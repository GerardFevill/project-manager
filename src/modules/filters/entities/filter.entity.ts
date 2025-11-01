import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum FilterScope {
  PRIVATE = 'private',
  PROJECT = 'project',
  GLOBAL = 'global',
}

@Entity('filters')
export class Filter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  jql: string; // Jira Query Language

  @Column({ type: 'varchar', length: 20, default: FilterScope.PRIVATE })
  scope: FilterScope;

  @Column({ type: 'varchar' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'boolean', default: false })
  isFavorite: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'simple-array', nullable: true })
  sharedWith: string[]; // User IDs

  @Column({ type: 'jsonb', nullable: true })
  columnConfig: Record<string, any>; // Column visibility and order

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
