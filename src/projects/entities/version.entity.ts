import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

/**
 * VERSION - Jira Version/Release
 *
 * Represents a version or release of the project.
 * Issues can be associated with:
 * - Fix Version: Version where issue will be fixed
 * - Affects Version: Version where bug was found
 */
@Entity('versions')
export class Version {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Project this version belongs to
   */
  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne('Project', 'versions', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: any;

  /**
   * Start date for this version
   */
  @Column({ type: 'date', nullable: true })
  startDate: Date;

  /**
   * Target release date
   */
  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  /**
   * Is this version released?
   */
  @Column({ default: false })
  released: boolean;

  /**
   * Is this version archived?
   */
  @Column({ default: false })
  archived: boolean;

  /**
   * Display order
   */
  @Column({ type: 'int', default: 0 })
  position: number;

  /**
   * Issues fixed in this version
   */
  @ManyToMany('Issue', 'fixVersions')
  fixIssues: any[];

  /**
   * Issues affected in this version (bugs)
   */
  @ManyToMany('Issue', 'affectsVersions')
  affectedIssues: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
