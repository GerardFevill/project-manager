import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

/**
 * 🌀 TASKS SERVICE - GESTION FRACTALE DES TÂCHES
 *
 * Ce service implémente la logique métier pour un système fractal de tâches:
 * - CRUD classique
 * - Navigation hiérarchique (parent/enfants)
 * - Filtres avancés
 * - Calcul automatique du niveau
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  // === CREATE ===

  /**
   * Créer une nouvelle tâche
   * Calcule automatiquement le niveau basé sur le parent
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);

    // Si parentId fourni, vérifier que le parent existe et calculer le niveau
    if (createTaskDto.parentId) {
      const parent = await this.findOne(createTaskDto.parentId);
      task.level = parent.level + 1;
    } else {
      task.level = 0; // Tâche racine
    }

    return this.tasksRepository.save(task);
  }

  // === READ ===

  /**
   * Récupérer toutes les tâches avec filtres
   */
  async findAll(filters?: TaskFilterDto): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');

    // Filtre par statut
    if (filters?.status === 'active') {
      query.andWhere('task.completed = :completed', { completed: false });
    } else if (filters?.status === 'completed') {
      query.andWhere('task.completed = :completed', { completed: true });
    }

    // Filtre par priorité
    if (filters?.priority) {
      query.andWhere('task.priority = :priority', { priority: filters.priority });
    }

    // Filtre tâches en retard
    if (filters?.onlyOverdue) {
      query.andWhere('task.dueDate < :today', { today: new Date() });
      query.andWhere('task.completed = :completed', { completed: false });
    }

    // Filtre tâches racines uniquement
    if (filters?.onlyRoot) {
      query.andWhere('task.parentId IS NULL');
    }

    // Filtre par parent spécifique
    if (filters?.parentId) {
      query.andWhere('task.parentId = :parentId', { parentId: filters.parentId });
    }

    // Tri par date de création (plus récent en premier)
    query.orderBy('task.createdAt', 'DESC');

    return query.getMany();
  }

  /**
   * Récupérer une tâche par ID avec ses relations
   */
  async findOne(id: string, includeRelations = false): Promise<Task> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.id = :id', { id });

    if (includeRelations) {
      query.leftJoinAndSelect('task.parent', 'parent');
      query.leftJoinAndSelect('task.children', 'children');
    }

    const task = await query.getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Récupérer les enfants (sous-tâches) d'une tâche
   */
  async findChildren(id: string): Promise<Task[]> {
    // Vérifier que la tâche parente existe
    await this.findOne(id);

    return this.tasksRepository.find({
      where: { parentId: id },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupérer l'arbre complet d'une tâche (récursif)
   */
  async findTree(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Charger récursivement les enfants de chaque enfant
    if (task.children && task.children.length > 0) {
      for (const child of task.children) {
        const childTree = await this.findTree(child.id);
        Object.assign(child, childTree);
      }
    }

    return task;
  }

  /**
   * Obtenir les statistiques globales
   */
  async getStats() {
    const [total, active, completed, overdue] = await Promise.all([
      this.tasksRepository.count(),
      this.tasksRepository.count({ where: { completed: false } }),
      this.tasksRepository.count({ where: { completed: true } }),
      this.tasksRepository
        .createQueryBuilder('task')
        .where('task.dueDate < :today', { today: new Date() })
        .andWhere('task.completed = :completed', { completed: false })
        .getCount(),
    ]);

    return {
      total,
      active,
      completed,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  // === UPDATE ===

  /**
   * Mettre à jour une tâche
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    // Si changement de parent, recalculer le niveau
    if (updateTaskDto.parentId !== undefined) {
      if (updateTaskDto.parentId === null) {
        task.level = 0; // Devient racine
      } else if (updateTaskDto.parentId !== task.parentId) {
        // Vérifier qu'on ne crée pas de cycle
        await this.checkCyclicReference(id, updateTaskDto.parentId);

        const newParent = await this.findOne(updateTaskDto.parentId);
        task.level = newParent.level + 1;

        // Mettre à jour récursivement le niveau de tous les enfants
        await this.updateChildrenLevels(id, task.level);
      }
    }

    // Si completion change, mettre à jour completedAt
    if (updateTaskDto.completed !== undefined && updateTaskDto.completed !== task.completed) {
      task.completedAt = updateTaskDto.completed ? new Date() : null;
    }

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  /**
   * Toggle le statut completed d'une tâche
   */
  async toggle(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.toggle();
    return this.tasksRepository.save(task);
  }

  // === DELETE ===

  /**
   * Supprimer une tâche
   * Cascade delete: supprime aussi tous les enfants
   */
  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }

  // === MÉTHODES UTILITAIRES PRIVÉES ===

  /**
   * Vérifier qu'un changement de parent ne crée pas de référence cyclique
   */
  private async checkCyclicReference(taskId: string, newParentId: string): Promise<void> {
    let currentId = newParentId;

    while (currentId) {
      if (currentId === taskId) {
        throw new BadRequestException('Cyclic reference detected: a task cannot be its own ancestor');
      }

      const parent = await this.tasksRepository.findOne({ where: { id: currentId } });
      currentId = parent?.parentId;
    }
  }

  /**
   * Mettre à jour récursivement le niveau de tous les enfants
   */
  private async updateChildrenLevels(parentId: string, parentLevel: number): Promise<void> {
    const children = await this.tasksRepository.find({ where: { parentId } });

    for (const child of children) {
      child.level = parentLevel + 1;
      await this.tasksRepository.save(child);

      // Récursif pour les petits-enfants
      await this.updateChildrenLevels(child.id, child.level);
    }
  }
}
