import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatusCategory } from '../enums/status-category.enum';

/**
 * STATUS - Jira Workflow Status
 *
 * Represents a status in the workflow (e.g., "To Do", "In Progress", "Done")
 * Statuses belong to a project and have a category
 */
@Entity('statuses')
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Status category (high-level grouping)
   */
  @Column({
    type: 'enum',
    enum: StatusCategory,
  })
  category: StatusCategory;

  /**
   * Project this status belongs to (null for global statuses)
   */
  @Column({ type: 'uuid', nullable: true })
  projectId: string;

  @ManyToOne('Project', 'statuses', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: any;

  /**
   * Display order in workflow
   */
  @Column({ type: 'int', default: 0 })
  position: number;

  /**
   * Color for UI display (hex code)
   */
  @Column({ length: 7, nullable: true })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
