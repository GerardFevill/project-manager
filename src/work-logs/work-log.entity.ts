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
 * WorkLog Entity - Jira-style time tracking
 * Records time spent on tasks by users
 */
@Entity('work_logs')
export class WorkLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Time logged in hours (can be decimal, e.g., 1.5 for 1h 30m)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  timeSpent: number;

  // Description of work done
  @Column({ type: 'text', nullable: true })
  description: string;

  // Date when the work was performed
  @Column({ type: 'date' })
  workDate: Date;

  // Task relationship
  @Column({ type: 'uuid' })
  taskId: string;

  @ManyToOne('Task', 'workLogs', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: any;

  // User who logged the time
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne('User', 'workLogs', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
