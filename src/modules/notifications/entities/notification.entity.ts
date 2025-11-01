import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

export enum NotificationType {
  ISSUE_ASSIGNED = 'issue_assigned',
  ISSUE_COMMENTED = 'issue_commented',
  ISSUE_UPDATED = 'issue_updated',
  ISSUE_MENTIONED = 'issue_mentioned',
  ISSUE_WATCHED = 'issue_watched',
  SPRINT_STARTED = 'sprint_started',
  SPRINT_COMPLETED = 'sprint_completed',
  RELEASE_CREATED = 'release_created',
  COMMENT_REPLIED = 'comment_replied',
  WORK_LOG_ADDED = 'work_log_added',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SLACK = 'slack',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', nullable: true })
  entityId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  entityType: string; // 'issue', 'sprint', 'comment', etc.

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  actorId: string; // User who triggered the notification

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actor_id' })
  actor: User;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'simple-array', default: '' })
  channels: NotificationChannel[];

  @Column({ type: 'boolean', default: false })
  emailSent: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
