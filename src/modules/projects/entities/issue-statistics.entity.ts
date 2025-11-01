import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('issue_statistics')
export class IssueStatistics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid', unique: true })
  projectId: string;

  @OneToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'total_issues', type: 'integer', default: 0 })
  totalIssues: number;

  @Column({ name: 'open_issues', type: 'integer', default: 0 })
  openIssues: number;

  @Column({ name: 'in_progress_issues', type: 'integer', default: 0 })
  inProgressIssues: number;

  @Column({ name: 'resolved_issues', type: 'integer', default: 0 })
  resolvedIssues: number;

  @Column({ name: 'closed_issues', type: 'integer', default: 0 })
  closedIssues: number;

  @Column({ name: 'average_resolution_time_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
  averageResolutionTimeHours: number;

  @Column({ name: 'active_users', type: 'integer', default: 0 })
  activeUsers: number;

  @Column({ name: 'last_activity', type: 'timestamp', nullable: true })
  lastActivity: Date;

  @CreateDateColumn({ name: 'calculated_at' })
  calculatedAt: Date;
}
