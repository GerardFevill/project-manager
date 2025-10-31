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
 * COMPONENT - Jira Component
 *
 * Components are subsections of a project used to group issues.
 * Examples: "Backend", "Frontend", "Database", "API"
 */
@Entity('components')
export class Component {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Project this component belongs to
   */
  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne('Project', 'components', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: any;

  /**
   * Component lead (responsible person)
   */
  @Column({ type: 'uuid', nullable: true })
  leadId: string;

  @ManyToOne('User', 'componentLeads', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'leadId' })
  lead: any;

  /**
   * Default assignee for issues in this component
   */
  @Column({ type: 'uuid', nullable: true })
  defaultAssigneeId: string;

  @ManyToOne('User', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'defaultAssigneeId' })
  defaultAssignee: any;

  /**
   * Issues associated with this component
   */
  @ManyToMany('Issue', 'components')
  issues: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
