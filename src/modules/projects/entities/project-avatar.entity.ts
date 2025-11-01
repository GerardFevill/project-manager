import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from './project.entity';

@Entity('project_avatars')
export class ProjectAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'project_id', type: 'uuid', unique: true })
  projectId: string;

  @OneToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500 })
  avatarUrl: string;

  @Column({ name: 'avatar_type', type: 'varchar', length: 50, default: 'uploaded' })
  avatarType: string;

  @Column({ name: 'file_size', type: 'integer', nullable: true })
  fileSize: number;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
