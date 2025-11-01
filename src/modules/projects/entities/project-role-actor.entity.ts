import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_role_actors')
export class ProjectRoleActor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid' })
  @Index()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'role_id', type: 'uuid' })
  @Index()
  roleId: string;

  @Column({ name: 'actor_id', type: 'uuid' })
  actorId: string;

  @Column({ name: 'actor_type', type: 'varchar', length: 50, comment: 'user or group' })
  actorType: 'user' | 'group';

  @Column({ name: 'actor_name', type: 'varchar', length: 255, nullable: true })
  actorName: string;

  @CreateDateColumn({ name: 'added_at' })
  addedAt: Date;
}
