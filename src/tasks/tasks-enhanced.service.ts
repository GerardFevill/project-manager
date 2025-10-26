import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, LessThan, MoreThan, Between, Like, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { TaskStatus } from './enums/task-status.enum';
import { TaskRecurrence } from './enums/task-recurrence.enum';
import { CreateTaskDto } from './dto/create-task-enhanced.dto';
import { UpdateTaskDto } from './dto/update-task-enhanced.dto';
import { TaskFilterDto } from './dto/task-filter-enhanced.dto';
import { PaginatedResponse } from './dto/paginated-response.dto';

/**
 * 🌀 TASKS SERVICE ENHANCED - GESTION FRACTALE AVANCÉE
 *
 * Service complet avec:
 * ✅ CRUD avancé
 * ✅ Gestion des statuts (draft, active, completed, blocked, recurring, archived)
 * ✅ Récurrence automatique
 * ✅ Historique complet (audit trail)
 * ✅ Navigation hiérarchique
 * ✅ Filtres avancés (15+ critères)
 * ✅ Analytics & statistiques
 * ✅ Actions spécialisées (block, archive, etc.)
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,
  ) {}

  // ============================================================================
  // CREATE
  // ============================================================================

  /**
   * Créer une nouvelle tâche
   * - Calcule automatiquement le niveau basé sur le parent
   * - Crée une entrée d'historique
   * - Gère la récurrence si configurée
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      status: createTaskDto.status || TaskStatus.DRAFT,
      progress: createTaskDto.progress || 0,
      priority: createTaskDto.priority || 'medium',
      recurrence: createTaskDto.recurrence || TaskRecurrence.NONE,
      actualHours: 0,
    });

    // Calcul du niveau hiérarchique
    if (createTaskDto.parentId) {
      const parent = await this.findOne(createTaskDto.parentId);
      task.level = parent.level + 1;
      task.parent = parent;
    } else {
      task.level = 0; // Tâche racine
    }

    // Validation de la récurrence
    if (
      task.recurrence !== TaskRecurrence.NONE &&
      !createTaskDto.nextOccurrence
    ) {
      throw new BadRequestException(
        'nextOccurrence is required when recurrence is set',
      );
    }

    const savedTask = await this.tasksRepository.save(task);

    // Créer l'entrée d'historique
    await this.createHistoryEntry(savedTask, 'created', {
      initialStatus: savedTask.status,
      initialProgress: savedTask.progress,
    });

    return savedTask;
  }

  // ============================================================================
  // READ
  // ============================================================================

  /**
   * Récupérer toutes les tâches avec filtres avancés
   * Supporte 15+ critères de filtrage, pagination et tri
   */
  async findAll(filters?: TaskFilterDto): Promise<PaginatedResponse<Task>> {
    const query = this.tasksRepository.createQueryBuilder('task');

    // Filtre par statut (simple ou multiple)
    if (filters?.statuses && filters.statuses.length > 0) {
      // Filtrage par plusieurs statuts (prioritaire)
      query.andWhere('task.status IN (:...statuses)', {
        statuses: filters.statuses,
      });
    } else if (filters?.status && filters.status !== 'all') {
      // Filtre par statut unique (rétrocompatibilité)
      query.andWhere('task.status = :status', { status: filters.status });
    }

    // Filtre par priorité (simple ou multiple)
    if (filters?.priorities && filters.priorities.length > 0) {
      // Filtrage par plusieurs priorités (prioritaire)
      query.andWhere('task.priority IN (:...priorities)', {
        priorities: filters.priorities,
      });
    } else if (filters?.priority) {
      // Filtre par priorité unique (rétrocompatibilité)
      query.andWhere('task.priority = :priority', {
        priority: filters.priority,
      });
    }

    // Filtre par récurrence
    if (filters?.recurrence) {
      query.andWhere('task.recurrence = :recurrence', {
        recurrence: filters.recurrence,
      });
    }

    // Filtre tâches racines uniquement
    if (filters?.onlyRoot) {
      query.andWhere('task.parentId IS NULL');
    }

    // Filtre tâches en retard
    if (filters?.onlyOverdue) {
      query.andWhere('task.dueDate < :today', { today: new Date() });
      query.andWhere('task.status != :completed', {
        completed: TaskStatus.COMPLETED,
      });
    }

    // Filtre par parent spécifique
    if (filters?.parentId) {
      query.andWhere('task.parentId = :parentId', {
        parentId: filters.parentId,
      });
    }

    // Filtre par tags (contient tous les tags)
    if (filters?.tags && filters.tags.length > 0) {
      query.andWhere('task.tags @> :tags', { tags: filters.tags });
    }

    // Recherche textuelle
    if (filters?.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // Inclure ou exclure les archivées
    if (!filters?.includeArchived) {
      query.andWhere('task.status != :archived', {
        archived: TaskStatus.ARCHIVED,
      });
      query.andWhere('task.deletedAt IS NULL');
    }

    // Filtre par plage de progression
    if (filters?.progressMin !== undefined) {
      query.andWhere('task.progress >= :progressMin', {
        progressMin: filters.progressMin,
      });
    }
    if (filters?.progressMax !== undefined) {
      query.andWhere('task.progress <= :progressMax', {
        progressMax: filters.progressMax,
      });
    }

    // Filtre par plage de dates d'échéance
    if (filters?.dueDateMin) {
      query.andWhere('task.dueDate >= :dueDateMin', {
        dueDateMin: new Date(filters.dueDateMin),
      });
    }
    if (filters?.dueDateMax) {
      query.andWhere('task.dueDate <= :dueDateMax', {
        dueDateMax: new Date(filters.dueDateMax),
      });
    }

    // Tri
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'DESC';
    query.orderBy(`task.${sortBy}`, sortOrder);

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Compter le total
    const total = await query.getCount();

    // Appliquer skip et take
    query.skip(skip).take(limit);

    // Récupérer les données
    const data = await query.getMany();

    // Calculer les métadonnées
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  /**
   * Récupérer une tâche par ID
   */
  async findOne(id: string, includeRelations = false): Promise<Task> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.id = :id', { id });

    if (includeRelations) {
      query.leftJoinAndSelect('task.parent', 'parent');
      query.leftJoinAndSelect('task.children', 'children');
      query.leftJoinAndSelect('task.history', 'history');
    }

    const task = await query.getOne();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  /**
   * Récupérer les enfants directs d'une tâche
   */
  async findChildren(id: string): Promise<Task[]> {
    await this.findOne(id); // Vérifier existence

    return this.tasksRepository.find({
      where: { parentId: id },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupérer l'arbre complet (récursif)
   */
  async findTree(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Charger récursivement
    if (task.children && task.children.length > 0) {
      for (const child of task.children) {
        const childTree = await this.findTree(child.id);
        Object.assign(child, childTree);
      }
    }

    return task;
  }

  /**
   * Récupérer les ancêtres d'une tâche jusqu'à la racine
   */
  async findAncestors(id: string): Promise<Task[]> {
    const ancestors: Task[] = [];
    let currentTask = await this.findOne(id);

    while (currentTask.parentId) {
      const parent = await this.findOne(currentTask.parentId);
      ancestors.push(parent);
      currentTask = parent;
    }

    return ancestors;
  }

  // ============================================================================
  // UPDATE
  // ============================================================================

  /**
   * Mettre à jour une tâche
   * - Gère le changement de parent avec recalcul des niveaux
   * - Crée un historique
   * - Recalcule la progression si nécessaire
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const oldStatus = task.status;
    const oldProgress = task.progress;

    // Gestion du changement de parent
    if (updateTaskDto.parentId !== undefined) {
      if (updateTaskDto.parentId === null) {
        task.level = 0;
      } else if (updateTaskDto.parentId !== task.parentId) {
        await this.checkCyclicReference(id, updateTaskDto.parentId);
        const newParent = await this.findOne(updateTaskDto.parentId);
        task.level = newParent.level + 1;
        await this.updateChildrenLevels(id, task.level);
      }
    }

    // Mise à jour des champs
    Object.assign(task, updateTaskDto);

    // Gestion auto de completedAt
    if (task.status === TaskStatus.COMPLETED && !task.completedAt) {
      task.completedAt = new Date();
      task.progress = 100;
    } else if (task.status !== TaskStatus.COMPLETED && task.completedAt) {
      task.completedAt = null;
    }

    const savedTask = await this.tasksRepository.save(task);

    // Historique
    await this.createHistoryEntry(savedTask, 'updated', {
      oldStatus,
      newStatus: savedTask.status,
      oldProgress,
      newProgress: savedTask.progress,
      changedFields: Object.keys(updateTaskDto),
    });

    return savedTask;
  }

  // ============================================================================
  // ACTIONS SPÉCIALISÉES
  // ============================================================================

  /**
   * Toggle le statut de complétion
   */
  async toggleCompletion(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.toggleCompletion();

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'toggled', {
      newStatus: savedTask.status,
      newProgress: savedTask.progress,
    });

    return savedTask;
  }

  /**
   * Bloquer une tâche avec raison
   */
  async blockTask(id: string, reason?: string): Promise<Task> {
    const task = await this.findOne(id);
    task.block(reason);

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'blocked', {
      reason,
      previousStatus: TaskStatus.ACTIVE,
    });

    return savedTask;
  }

  /**
   * Débloquer une tâche
   */
  async unblockTask(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.unblock();

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'unblocked');

    return savedTask;
  }

  /**
   * Archiver une tâche (soft delete)
   */
  async archiveTask(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.archive();

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'archived', {
      previousStatus: task.status,
    });

    return savedTask;
  }

  /**
   * Restaurer une tâche archivée
   */
  async unarchiveTask(id: string): Promise<Task> {
    const task = await this.findOne(id);
    task.unarchive();

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'unarchived', {
      newStatus: savedTask.status,
    });

    return savedTask;
  }

  /**
   * Calculer et appliquer la prochaine occurrence
   */
  async moveToNextOccurrence(id: string): Promise<Task> {
    const task = await this.findOne(id);

    if (task.recurrence === TaskRecurrence.NONE) {
      throw new BadRequestException(
        'Task does not have recurrence configured',
      );
    }

    task.moveToNextOccurrence();

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'moved_to_next_occurrence', {
      nextOccurrence: savedTask.nextOccurrence,
      lastOccurrence: savedTask.lastOccurrence,
    });

    return savedTask;
  }

  /**
   * Recalculer la progression basée sur les enfants
   */
  async calculateProgressFromChildren(id: string): Promise<Task> {
    const task = await this.findOne(id, true);

    if (!task.children || task.children.length === 0) {
      return task;
    }

    task.calculateProgressFromChildren(task.children);

    const savedTask = await this.tasksRepository.save(task);

    await this.createHistoryEntry(savedTask, 'progress_recalculated', {
      newProgress: savedTask.progress,
      childrenCount: task.children.length,
    });

    return savedTask;
  }

  // ============================================================================
  // DELETE
  // ============================================================================

  /**
   * Supprimer définitivement une tâche (hard delete)
   * Cascade: supprime tous les enfants
   */
  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);

    // Créer l'historique avant suppression
    await this.createHistoryEntry(task, 'deleted', {
      finalStatus: task.status,
      hadChildren: task.children?.length > 0,
    });

    await this.tasksRepository.remove(task);
  }

  // ============================================================================
  // ANALYTICS & STATISTIQUES
  // ============================================================================

  /**
   * Statistiques globales
   */
  async getStatistics() {
    const [
      total,
      byStatus,
      byPriority,
      overdue,
      avgProgress,
      upcomingRecurrences,
    ] = await Promise.all([
      // Total
      this.tasksRepository.count({
        where: { deletedAt: IsNull() },
      }),

      // Par statut
      Promise.all(
        Object.values(TaskStatus).map(async (status) => ({
          status,
          count: await this.tasksRepository.count({
            where: { status, deletedAt: IsNull() },
          }),
        })),
      ),

      // Par priorité
      Promise.all(
        ['low', 'medium', 'high', 'urgent'].map(async (priority: any) => ({
          priority,
          count: await this.tasksRepository.count({
            where: { priority, deletedAt: IsNull() },
          }),
        })),
      ),

      // En retard
      this.tasksRepository
        .createQueryBuilder('task')
        .where('task.dueDate < :today', { today: new Date() })
        .andWhere('task.status != :completed', {
          completed: TaskStatus.COMPLETED,
        })
        .andWhere('task.deletedAt IS NULL')
        .getCount(),

      // Progression moyenne
      this.tasksRepository
        .createQueryBuilder('task')
        .select('AVG(task.progress)', 'avg')
        .where('task.deletedAt IS NULL')
        .getRawOne(),

      // Prochaines récurrences (7 jours)
      this.getUpcomingRecurrences(7),
    ]);

    const completed = byStatus.find((s) => s.status === TaskStatus.COMPLETED)
      ?.count || 0;

    return {
      total,
      byStatus: byStatus.reduce((acc, { status, count }) => {
        acc[status] = count;
        return acc;
      }, {} as Record<string, number>),
      byPriority: byPriority.reduce((acc, { priority, count }) => {
        acc[priority] = count;
        return acc;
      }, {} as Record<string, number>),
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgProgress: Math.round(parseFloat(avgProgress?.avg || '0')),
      upcomingRecurrences: {
        count: upcomingRecurrences.length,
        tasks: upcomingRecurrences,
      },
    };
  }

  /**
   * Récupérer les tâches récurrentes à venir
   */
  async getUpcomingRecurrences(days: number = 7): Promise<Task[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.tasksRepository.find({
      where: {
        recurrence: Not(TaskRecurrence.NONE),
        nextOccurrence: Between(new Date(), futureDate),
        deletedAt: IsNull(),
      },
      order: { nextOccurrence: 'ASC' },
    });
  }

  /**
   * Récupérer l'historique d'une tâche
   */
  async getTaskHistory(id: string): Promise<TaskHistory[]> {
    await this.findOne(id); // Vérifier existence

    return this.historyRepository.find({
      where: { taskId: id },
      order: { executedAt: 'DESC' },
    });
  }

  /**
   * Obtenir la progression détaillée d'une tâche
   */
  async getTaskProgress(id: string) {
    const task = await this.findOne(id, true);
    const history = await this.getTaskHistory(id);

    return {
      task: {
        id: task.id,
        title: task.title,
        status: task.status,
        progress: task.progress,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
      },
      children: task.children?.map((c) => ({
        id: c.id,
        title: c.title,
        progress: c.progress,
      })),
      timeline: history.slice(0, 10), // Dernières 10 entrées
      metrics: {
        timeVariance:
          task.estimatedHours && task.actualHours
            ? task.actualHours - task.estimatedHours
            : null,
        daysUntilDue: task.dueDate
          ? Math.ceil(
              (new Date(task.dueDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            )
          : null,
        isOverdue: task.isOverdue(),
      },
    };
  }

  // ============================================================================
  // MÉTHODES UTILITAIRES PRIVÉES
  // ============================================================================

  /**
   * Créer une entrée d'historique
   */
  private async createHistoryEntry(
    task: Task,
    action: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.historyRepository.save({
      taskId: task.id,
      action,
      statusAtExecution: task.status,
      progressAtExecution: task.progress,
      metadata,
      executedAt: new Date(),
    });
  }

  /**
   * Vérifier qu'un changement de parent ne crée pas de cycle
   */
  private async checkCyclicReference(
    taskId: string,
    newParentId: string,
  ): Promise<void> {
    let currentId = newParentId;

    while (currentId) {
      if (currentId === taskId) {
        throw new BadRequestException(
          'Cyclic reference detected: a task cannot be its own ancestor',
        );
      }

      const parent = await this.tasksRepository.findOne({
        where: { id: currentId },
      });
      currentId = parent?.parentId;
    }
  }

  /**
   * Mettre à jour récursivement les niveaux des enfants
   */
  private async updateChildrenLevels(
    parentId: string,
    parentLevel: number,
  ): Promise<void> {
    const children = await this.tasksRepository.find({
      where: { parentId },
    });

    for (const child of children) {
      child.level = parentLevel + 1;
      await this.tasksRepository.save(child);
      await this.updateChildrenLevels(child.id, child.level);
    }
  }
}
