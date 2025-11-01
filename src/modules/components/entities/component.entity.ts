import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity('component')
export class Component {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'project_id', type: 'bigint' })
  projectId: string;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'lead_id', type: 'bigint', nullable: true })
  leadId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: User;

  @Column({ name: 'assignee_type', length: 50, default: 'PROJECT_DEFAULT' })
  assigneeType: string; // PROJECT_DEFAULT, COMPONENT_LEAD, PROJECT_LEAD, UNASSIGNED

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
