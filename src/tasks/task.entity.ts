import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IssueType } from './enums/issue-type.enum';

/**
 * 🌀 ENTITÉ TASK - STRUCTURE FRACTALE
 *
 * Cette entité implémente une structure fractale permettant :
 * - Une hiérarchie parent/enfant infinie
 * - Chaque tâche peut avoir des sous-tâches
 * - Chaque sous-tâche peut elle-même avoir des sous-tâches
 * - Navigation bidirectionnelle (parent -> enfants, enfant -> parent)
 */
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @Column({
    type: 'enum',
    enum: IssueType,
    default: IssueType.TASK,
  })
  issueType: IssueType;

  // === USER ASSIGNMENT ===

  /**
   * ID of the user assigned to this task (null if unassigned)
   */
  @Column({ type: 'uuid', nullable: true })
  assigneeId: string;

  /**
   * Relation to the assigned user
   * Many-to-one: multiple tasks can be assigned to one user
   */
  @ManyToOne('User', 'assignedTasks', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee: any; // Type 'any' to avoid circular dependency

  // === SPRINT RELATIONSHIP ===

  /**
   * ID du sprint auquel la tâche est assignée (null si pas de sprint)
   */
  @Column({ type: 'int', nullable: true })
  sprintId: number;

  /**
   * Relation vers le sprint
   * Many-to-one: plusieurs tâches peuvent être dans un sprint
   */
  @ManyToOne('Sprint', 'tasks', {
    onDelete: 'SET NULL', // Si sprint supprimé, tâche reste mais sprintId = null
    nullable: true,
  })
  @JoinColumn({ name: 'sprintId' })
  sprint: any; // Type 'any' pour éviter la dépendance circulaire

  // === STRUCTURE FRACTALE ===

  /**
   * Niveau dans la hiérarchie
   * 0 = tâche racine (projet)
   * 1 = sous-tâche de niveau 1
   * 2 = sous-tâche de niveau 2
   * etc.
   */
  @Column({ default: 0 })
  level: number;

  /**
   * ID du parent (null si racine)
   * Permet la navigation vers le haut de l'arbre
   */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  /**
   * Relation vers le parent
   * Self-referencing many-to-one
   */
  @ManyToOne(() => Task, (task) => task.children, {
    onDelete: 'CASCADE', // Si parent supprimé, enfants aussi
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Task;

  /**
   * Relation vers les enfants (sous-tâches)
   * Self-referencing one-to-many
   */
  @OneToMany(() => Task, (task) => task.parent)
  children: Task[];

  /**
   * Relation to comments
   * One-to-many: one task can have many comments
   */
  @OneToMany('Comment', 'task')
  comments: any[];

  /**
   * Relation to work logs
   * One-to-many: one task can have many work log entries
   */
  @OneToMany('WorkLog', 'task')
  workLogs: any[];

  // === MÉTADONNÉES ===

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  // === MÉTHODES UTILITAIRES ===

  /**
   * Vérifie si la tâche est en retard
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  /**
   * Vérifie si c'est une tâche racine
   */
  isRoot(): boolean {
    return this.parentId === null;
  }

  /**
   * Toggle le statut completed
   */
  toggle(): void {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date() : null;
  }
}
