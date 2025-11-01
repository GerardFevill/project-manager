import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'project_key', unique: true, length: 50 })
  projectKey: string;

  @Column({ name: 'project_name', length: 500 })
  projectName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'project_type', length: 50, nullable: true })
  projectType: string;

  @Column({ name: 'project_category', type: 'bigint', nullable: true })
  projectCategory: string;

  @Column({ name: 'lead_user_id', type: 'bigint', nullable: true })
  leadUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lead_user_id' })
  lead: User;

  @Column({ name: 'avatar_id', type: 'bigint', nullable: true })
  avatarId: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'assignee_type', type: 'bigint', nullable: true })
  assigneeType: string;
}
