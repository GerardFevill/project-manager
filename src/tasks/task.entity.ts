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
