import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskRecurrence } from '../enums/task-recurrence.enum';
import { TaskHistory } from './task-history.entity';

/**
 * 🌀 ENTITÉ TASK - SYSTÈME FRACTAL AVANCÉ
 *
 * Système de gestion de tâches hiérarchiques avec:
 * ✅ Structure fractale illimitée (parent-enfant)
 * ✅ Gestion avancée des statuts et progression
 * ✅ Système de récurrence automatique
 * ✅ Historique complet des actions (audit trail)
 * ✅ Tags et métadonnées flexibles
 * ✅ Calculs automatiques (overdue, completion, etc.)
 */
@Entity('tasks')
@Index(['status', 'priority']) // Index composite pour les requêtes fréquentes
@Index(['parentId']) // Index pour les requêtes hiérarchiques
@Index(['nextOccurrence']) // Index pour le traitement des récurrences
export class Task {
  // === IDENTITÉ ===

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // === STATUT & PROGRESSION ===

  /**
   * Statut actuel de la tâche
   * Gère le cycle de vie complet: draft → active → completed/archived
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.DRAFT,
  })
  status: TaskStatus;

  /**
   * Progression de 0 à 100%
   * Calculée automatiquement pour les tâches parentes (moyenne des enfants)
   */
  @Column({ type: 'int', default: 0 })
  progress: number;

  /**
   * Priorité de la tâche
   */
  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // === DATES & ÉCHÉANCES ===

  /**
   * Date d'échéance (deadline)
   */
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  /**
   * Date de début planifiée
   */
  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  /**
   * Date de complétion effective
   */
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  // === RÉCURRENCE ===

  /**
   * Type de récurrence (none, daily, weekly, monthly, yearly)
   */
  @Column({
    type: 'enum',
    enum: TaskRecurrence,
    default: TaskRecurrence.NONE,
  })
  recurrence: TaskRecurrence;

  /**
   * Prochaine occurrence pour les tâches récurrentes
   * Calculée automatiquement selon la fréquence
   */
  @Column({ type: 'timestamp', nullable: true })
  nextOccurrence: Date;

  /**
   * Date de la dernière occurrence traitée
   */
  @Column({ type: 'timestamp', nullable: true })
  lastOccurrence: Date;

  // === STRUCTURE FRACTALE ===

  /**
   * Niveau dans la hiérarchie
   * 0 = racine (projet), 1 = sous-tâche niveau 1, etc.
   */
  @Column({ default: 0 })
  level: number;

  /**
   * ID du parent (null si racine)
   */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  /**
   * Relation vers le parent (many-to-one)
   */
  @ManyToOne(() => Task, (task) => task.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Task;

  /**
   * Relation vers les enfants (one-to-many)
   */
  @OneToMany(() => Task, (task) => task.parent, {
    cascade: true,
  })
  children: Task[];

  // === TAGS & MÉTADONNÉES ===

  /**
   * Tags pour catégorisation et filtrage
   * Ex: ['urgent', 'backend', 'bug-fix']
   */
  @Column('simple-array', { nullable: true })
  tags: string[];

  /**
   * Métadonnées flexibles au format JSON
   * Permet d'ajouter des données custom sans modifier le schéma
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Estimation du temps en heures
   */
  @Column({ type: 'float', nullable: true })
  estimatedHours: number;

  /**
   * Temps réel passé en heures
   */
  @Column({ type: 'float', default: 0 })
  actualHours: number;

  // === AUDIT TRAIL ===

  /**
   * Historique des actions sur cette tâche
   */
  @OneToMany(() => TaskHistory, (history) => history.task, {
    cascade: true,
  })
  history: TaskHistory[];

  // === MÉTADONNÉES SYSTÈME ===

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Soft delete - marque comme supprimée sans supprimer physiquement
   */
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // === MÉTHODES UTILITAIRES ===

  /**
   * Vérifie si la tâche est en retard
   * @returns true si la date d'échéance est passée et la tâche n'est pas complétée
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.status === TaskStatus.COMPLETED) {
      return false;
    }
    return new Date(this.dueDate) < new Date();
  }

  /**
   * Vérifie si c'est une tâche racine (niveau 0)
   */
  isRoot(): boolean {
    return this.parentId === null && this.level === 0;
  }

  /**
   * Vérifie si la tâche est récurrente
   */
  isRecurring(): boolean {
    return this.recurrence !== TaskRecurrence.NONE;
  }

  /**
   * Toggle le statut de complétion
   * Active ↔ Completed
   */
  toggleCompletion(): void {
    if (this.status === TaskStatus.COMPLETED) {
      this.status = TaskStatus.ACTIVE;
      this.progress = 0;
      this.completedAt = null;
    } else {
      this.status = TaskStatus.COMPLETED;
      this.progress = 100;
      this.completedAt = new Date();
    }
  }

  /**
   * Calcule et met à jour la prochaine occurrence selon la récurrence
   * Utilisé par le système de tâches récurrentes
   */
  moveToNextOccurrence(): void {
    if (this.recurrence === TaskRecurrence.NONE) {
      return;
    }

    const baseDate = this.nextOccurrence || this.dueDate || new Date();
    let nextDate = new Date(baseDate);

    switch (this.recurrence) {
      case TaskRecurrence.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;

      case TaskRecurrence.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;

      case TaskRecurrence.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;

      case TaskRecurrence.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    this.lastOccurrence = this.nextOccurrence || new Date();
    this.nextOccurrence = nextDate;

    // Si la tâche était complétée, on la réinitialise pour la prochaine occurrence
    if (this.status === TaskStatus.COMPLETED) {
      this.status = TaskStatus.RECURRING;
      this.progress = 0;
      this.completedAt = null;
    }
  }

  /**
   * Calcule le taux de complétion basé sur les sous-tâches
   * @param children - Les enfants directs de cette tâche
   */
  calculateProgressFromChildren(children: Task[]): void {
    if (!children || children.length === 0) {
      return;
    }

    const totalProgress = children.reduce((sum, child) => sum + child.progress, 0);
    this.progress = Math.round(totalProgress / children.length);

    // Si tous les enfants sont à 100%, marquer le parent comme complété
    if (this.progress === 100 && this.status === TaskStatus.ACTIVE) {
      this.status = TaskStatus.COMPLETED;
      this.completedAt = new Date();
    }
  }

  /**
   * Archive la tâche (soft delete amélioré)
   */
  archive(): void {
    this.status = TaskStatus.ARCHIVED;
    this.deletedAt = new Date();
  }

  /**
   * Restaure une tâche archivée
   */
  unarchive(): void {
    if (this.status === TaskStatus.ARCHIVED) {
      this.status = this.progress === 100 ? TaskStatus.COMPLETED : TaskStatus.ACTIVE;
      this.deletedAt = null;
    }
  }

  /**
   * Bloque la tâche avec une raison
   * @param reason - Raison du blocage (stockée dans metadata)
   */
  block(reason?: string): void {
    this.status = TaskStatus.BLOCKED;
    if (reason) {
      this.metadata = {
        ...this.metadata,
        blockReason: reason,
        blockedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Débloque la tâche
   */
  unblock(): void {
    if (this.status === TaskStatus.BLOCKED) {
      this.status = TaskStatus.ACTIVE;
      if (this.metadata) {
        delete this.metadata.blockReason;
        delete this.metadata.blockedAt;
      }
    }
  }
}
