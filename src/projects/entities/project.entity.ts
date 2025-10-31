import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

/**
 * PROJECT - Jira Project Entity
 *
 * Represents a Jira project that contains issues.
 * Projects are the top-level organizational unit in Jira.
 */
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Project key (unique identifier like "PROJ", "DEV", "SCRUM")
   * Used in issue keys like "PROJ-123"
   */
  @Column({ length: 10, unique: true })
  key: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Project lead (user responsible for the project)
   */
  @Column({ type: 'uuid', nullable: true })
  leadId: string;

  @ManyToOne('User', 'leadProjects', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'leadId' })
  lead: any;

  /**
   * Project avatar URL
   */
  @Column({ nullable: true })
  avatarUrl: string;

  /**
   * Project category (e.g., "Software", "Marketing", "HR")
   */
  @Column({ length: 100, nullable: true })
  category: string;

  /**
   * Default assignee for new issues
   * - 'unassigned': No default assignee
   * - 'project_lead': Assign to project lead
   * - 'component_lead': Assign to component lead
   */
  @Column({ default: 'unassigned' })
  defaultAssignee: 'unassigned' | 'project_lead' | 'component_lead';

  /**
   * Is this project archived?
   */
  @Column({ default: false })
  archived: boolean;

  /**
   * Relations
   */
  @OneToMany('Issue', 'project')
  issues: any[];

  @OneToMany('Component', 'project')
  components: any[];

  @OneToMany('Version', 'project')
  versions: any[];

  @OneToMany('Sprint', 'project')
  sprints: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
