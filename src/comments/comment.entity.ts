import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Comment Entity - Jira-style comments for tasks
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // Task relationship
  @Column({ type: 'uuid' })
  taskId: string;

  @ManyToOne('Task', 'comments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: any;

  // Author relationship
  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne('User', 'comments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: any;

  // Edit tracking
  @Column({ default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
