import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from '../enums/task-status.enum';

/**
 * 📜 ENTITÉ TASK HISTORY - AUDIT TRAIL
 *
 * Enregistre chaque exécution/modification d'une tâche pour:
 * - Traçabilité complète des actions
 * - Historique des performances
 * - Analytics et reporting
 * - Conformité et audit
 */
@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === RELATION AVEC LA TÂCHE ===

  /**
   * ID de la tâche concernée
   */
  @Column({ type: 'uuid' })
  taskId: string;

  /**
   * Relation vers la tâche (many-to-one)
   * Une tâche peut avoir plusieurs entrées d'historique
   */
  @ManyToOne(() => Task, (task) => task.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  // === DONNÉES D'EXÉCUTION ===

  /**
   * Statut de la tâche au moment de l'exécution
   */
  @Column({
    type: 'enum',
    enum: TaskStatus,
  })
  statusAtExecution: TaskStatus;

  /**
   * Progression (%) au moment de l'exécution
   */
  @Column({ type: 'int', default: 0 })
  progressAtExecution: number;

  /**
   * Durée d'exécution en secondes
   * null si la tâche n'est pas encore terminée
   */
  @Column({ type: 'int', nullable: true })
  duration: number;

  /**
   * Action effectuée (created, updated, completed, archived, etc.)
   */
  @Column({ length: 50 })
  action: string;

  /**
   * Données supplémentaires au format JSON
   * Peut contenir: changements de champs, métadonnées, contexte, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Utilisateur ayant effectué l'action (si applicable)
   * TODO: Lier à une entité User quand l'authentification sera implémentée
   */
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  /**
   * Commentaire ou note ajoutée lors de l'action
   */
  @Column({ type: 'text', nullable: true })
  notes: string;

  // === MÉTADONNÉES ===

  /**
   * Date et heure de l'action
   */
  @CreateDateColumn()
  executedAt: Date;
}
