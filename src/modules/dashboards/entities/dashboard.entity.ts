import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { DashboardWidget } from './dashboard-widget.entity';

export enum DashboardScope {
  PRIVATE = 'private',
  PROJECT = 'project',
  GLOBAL = 'global',
}

@Entity('dashboards')
export class Dashboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 20, default: DashboardScope.PRIVATE })
  scope: DashboardScope;

  @Column({ type: 'varchar' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @Column({ type: 'simple-array', nullable: true })
  sharedWith: string[]; // User IDs

  @OneToMany(() => DashboardWidget, widget => widget.dashboard, { cascade: true })
  widgets: DashboardWidget[];

  @Column({ type: 'jsonb', nullable: true })
  layout: Record<string, any>; // Grid layout configuration

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
