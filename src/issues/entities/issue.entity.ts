import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  BeforeInsert,
} from 'typeorm';
import { IssueType } from '../enums/issue-type.enum';
import { Priority } from '../enums/priority.enum';
import { Resolution } from '../enums/resolution.enum';

/**
 * ISSUE - Jira Issue Entity (replaces Task)
 *
 * Central entity in Jira that represents work items:
 * - Epics: Large bodies of work
 * - Stories: User stories with business value
 * - Tasks: Work that needs to be done
 * - Bugs: Problems that need fixing
 * - Subtasks: Breakdown of other issues
 */
@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Issue key (e.g., "PROJ-123")
   * Unique identifier combining project key + sequence number
   */
  @Column({ length: 50, unique: true })
  key: string;

  /**
   * Project this issue belongs to
   */
  @Column({ type: 'uuid' })
  projectId: string;

  @ManyToOne('Project', 'issues', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: any;

  /**
   * Issue type (Epic, Story, Task, Bug, Subtask)
   */
  @Column({
    type: 'enum',
    enum: IssueType,
    default: IssueType.TASK,
  })
  issueType: IssueType;

  /**
   * Issue summary (title)
   */
  @Column({ length: 255 })
  summary: string;

  /**
   * Detailed description
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * Current status
   */
  @Column({ type: 'uuid' })
  statusId: string;

  @ManyToOne('Status', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'statusId' })
  status: any;

  /**
   * Resolution (how issue was resolved)
   */
  @Column({
    type: 'enum',
    enum: Resolution,
    default: Resolution.UNRESOLVED,
  })
  resolution: Resolution;

  /**
   * Priority level
   */
  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.MEDIUM,
  })
  priority: Priority;

  // =============== PEOPLE ===============

  /**
   * User assigned to work on this issue
   */
  @Column({ type: 'uuid', nullable: true })
  assigneeId: string;

  @ManyToOne('User', 'assignedIssues', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'assigneeId' })
  assignee: any;

  /**
   * User who reported/created this issue
   */
  @Column({ type: 'uuid' })
  reporterId: string;

  @ManyToOne('User', 'reportedIssues', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reporterId' })
  reporter: any;

  // =============== HIERARCHY ===============

  /**
   * Parent issue (for Epic -> Story -> Subtask hierarchy)
   */
  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @ManyToOne(() => Issue, (issue) => issue.children, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parent: Issue;

  @OneToMany(() => Issue, (issue) => issue.parent)
  children: Issue[];

  /**
   * Epic link (for linking stories to epics)
   * Stories and tasks can belong to an epic without being subtasks
   */
  @Column({ type: 'uuid', nullable: true })
  epicId: string;

  @ManyToOne(() => Issue, (issue) => issue.epicChildren, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'epicId' })
  epic: Issue;

  @OneToMany(() => Issue, (issue) => issue.epic)
  epicChildren: Issue[];

  // =============== TIME TRACKING ===============

  /**
   * Original time estimate (hours)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalEstimate: number;

  /**
   * Remaining time estimate (hours)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  remainingEstimate: number;

  /**
   * Total time spent (hours) - calculated from work logs
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  timeSpent: number;

  /**
   * Story points (for Scrum estimation)
   */
  @Column({ type: 'int', nullable: true })
  storyPoints: number;

  // =============== DATES ===============

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolutionDate: Date;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  // =============== SPRINT (AGILE) ===============

  @Column({ type: 'int', nullable: true })
  sprintId: number;

  @ManyToOne('Sprint', 'issues', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'sprintId' })
  sprint: any;

  // =============== COMPONENTS ===============

  @ManyToMany('Component', 'issues')
  @JoinTable({
    name: 'issue_components',
    joinColumn: { name: 'issueId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'componentId', referencedColumnName: 'id' },
  })
  components: any[];

  // =============== VERSIONS ===============

  @ManyToMany('Version', 'fixIssues')
  @JoinTable({
    name: 'issue_fix_versions',
    joinColumn: { name: 'issueId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'versionId', referencedColumnName: 'id' },
  })
  fixVersions: any[];

  @ManyToMany('Version', 'affectedIssues')
  @JoinTable({
    name: 'issue_affects_versions',
    joinColumn: { name: 'issueId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'versionId', referencedColumnName: 'id' },
  })
  affectsVersions: any[];

  // =============== LABELS ===============

  @Column({ type: 'simple-array', nullable: true })
  labels: string[];

  // =============== ENVIRONMENT ===============

  /**
   * Environment where bug was found (for bugs)
   */
  @Column({ type: 'text', nullable: true })
  environment: string;

  // =============== SECURITY LEVEL ===============

  /**
   * Security/visibility level
   */
  @Column({ nullable: true })
  securityLevel: string;

  // =============== RELATIONS ===============

  @OneToMany('Comment', 'issue')
  comments: any[];

  @OneToMany('WorkLog', 'issue')
  workLogs: any[];

  @OneToMany('IssueLink', 'sourceIssue')
  outwardLinks: any[];

  @OneToMany('IssueLink', 'targetIssue')
  inwardLinks: any[];

  @OneToMany('Attachment', 'issue')
  attachments: any[];

  // =============== UTILITY METHODS ===============

  /**
   * Check if issue is overdue
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.resolution !== Resolution.UNRESOLVED) {
      return false;
    }
    return new Date(this.dueDate) < new Date();
  }

  /**
   * Check if issue is resolved
   */
  isResolved(): boolean {
    return this.resolution !== Resolution.UNRESOLVED;
  }

  /**
   * Check if this is an epic
   */
  isEpic(): boolean {
    return this.issueType === IssueType.EPIC;
  }

  /**
   * Check if this is a subtask
   */
  isSubtask(): boolean {
    return this.issueType === IssueType.SUBTASK;
  }
}
