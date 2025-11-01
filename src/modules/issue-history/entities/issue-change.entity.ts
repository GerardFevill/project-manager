import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Issue } from '../../issues/entities/issue.entity';
import { User } from '../../users/user.entity';

@Entity('issue_changes')
export class IssueChange {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  issueId: string;

  @ManyToOne(() => Issue)
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @Column({ type: 'varchar', nullable: true })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  changeType: string; // 'field_change', 'status_change', 'comment_added', 'attachment_added', etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  fieldName: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string;

  @Column({ type: 'text', nullable: true })
  newValue: string;

  @Column({ type: 'text', nullable: true })
  changeDescription: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
