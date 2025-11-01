import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WebhookEvent {
  ISSUE_CREATED = 'issue:created',
  ISSUE_UPDATED = 'issue:updated',
  ISSUE_DELETED = 'issue:deleted',
  COMMENT_CREATED = 'comment:created',
  SPRINT_STARTED = 'sprint:started',
  SPRINT_COMPLETED = 'sprint:completed',
  PROJECT_CREATED = 'project:created',
  USER_ASSIGNED = 'user:assigned',
}

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'simple-array' })
  events: WebhookEvent[];

  @Column({ type: 'varchar', nullable: true })
  projectId: string; // null = global webhook

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  secret: string; // For HMAC signature

  @Column({ type: 'jsonb', nullable: true })
  headers: Record<string, string>; // Custom headers

  @Column({ type: 'int', default: 0 })
  successCount: number;

  @Column({ type: 'int', default: 0 })
  failureCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggeredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSuccessAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastFailureAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
