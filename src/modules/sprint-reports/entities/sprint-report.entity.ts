import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sprint_reports')
export class SprintReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  sprintId: string;

  @Column({ type: 'jsonb' })
  metrics: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  completedIssues: any[];

  @Column({ type: 'jsonb', nullable: true })
  incompletedIssues: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
