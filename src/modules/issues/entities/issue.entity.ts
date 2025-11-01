import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Label } from '../../labels/entities/label.entity';

@Entity('jira_issue')
export class Issue {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'issue_key', unique: true, length: 100 })
  issueKey: string;

  @Column({ name: 'project_id', type: 'bigint' })
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'issue_type', length: 50 })
  issueType: string;

  @Column({ length: 500 })
  summary: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'status', length: 50, default: 'Open' })
  status: string;

  @Column({ name: 'priority', length: 50, default: 'Medium' })
  priority: string;

  @Column({ name: 'resolution', length: 50, nullable: true })
  resolution: string;

  @Column({ name: 'reporter_id', type: 'bigint', nullable: true })
  reporterId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ name: 'assignee_id', type: 'bigint', nullable: true })
  assigneeId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignee_id' })
  assignee: User;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ name: 'environment', type: 'text', nullable: true })
  environment: string;

  @Column({ name: 'original_estimate', type: 'bigint', nullable: true })
  originalEstimate: number;

  @Column({ name: 'remaining_estimate', type: 'bigint', nullable: true })
  remainingEstimate: number;

  @Column({ name: 'time_spent', type: 'bigint', nullable: true })
  timeSpent: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolvedAt: Date;

  // Relations with new modules
  @ManyToMany(() => Label, (label) => label.issues)
  @JoinTable({
    name: 'issue_label',
    joinColumn: { name: 'issue_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'label_id', referencedColumnName: 'id' },
  })
  labels: Label[];
}
