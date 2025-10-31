import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

/**
 * User Roles - Jira style
 */
export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DEVELOPER,
  })
  role: UserRole;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  department: string;

  @Column({ default: true })
  isActive: boolean;

  // === JIRA RELATIONS ===

  // Issues assigned to this user
  @OneToMany('Issue', 'assignee')
  assignedIssues: any[];

  // Issues reported by this user
  @OneToMany('Issue', 'reporter')
  reportedIssues: any[];

  // Projects where user is lead
  @OneToMany('Project', 'lead')
  leadProjects: any[];

  // Components where user is lead
  @OneToMany('Component', 'lead')
  componentLeads: any[];

  // Comments authored by this user
  @OneToMany('Comment', 'author')
  comments: any[];

  // Work logs by this user
  @OneToMany('WorkLog', 'user')
  workLogs: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Get full name of the user
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Get initials for avatar display
   */
  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }
}
