import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  action: string; // 'create', 'update', 'delete', 'login', 'permission_change', etc.

  @Column({ type: 'varchar', length: 100 })
  entityType: string; // 'issue', 'project', 'user', etc.

  @Column({ type: 'varchar', nullable: true })
  entityId: string;

  @Column({ type: 'varchar', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', nullable: true })
  userAgent: string;

  @Column({ type: 'jsonb', nullable: true })
  changes: Record<string, any>; // Before/after values

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
