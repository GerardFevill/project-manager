import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('automation_rules')
export class AutomationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'varchar', length: 50 })
  triggerEvent: string; // 'issue_created', 'status_changed', etc.

  @Column({ type: 'jsonb' })
  conditions: Record<string, any>; // Conditions to match

  @Column({ type: 'jsonb' })
  actions: Array<{ type: string; config: Record<string, any> }>; // Actions to execute

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  executionCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastExecutedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
