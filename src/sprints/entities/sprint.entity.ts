import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SprintStatus } from '../enums/sprint-status.enum';

/**
 * SPRINT - Jira Sprint Entity
 *
 * Represents a sprint in Scrum/Agile methodology.
 * Sprints contain issues that are planned for a specific time period.
 */
@Entity('sprints')
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  goal: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({
    type: 'enum',
    enum: SprintStatus,
    default: SprintStatus.PLANNED,
  })
  status: SprintStatus;

  /**
   * Project this sprint belongs to
   */
  @Column({ type: 'uuid', nullable: true })
  projectId: string;

  @ManyToOne('Project', 'sprints', {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'projectId' })
  project: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Issues in this sprint
   * One-to-many: a sprint can contain multiple issues
   */
  @OneToMany('Issue', 'sprint')
  issues: any[];
}
