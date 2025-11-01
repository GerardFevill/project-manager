import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Issue } from '../../issues/entities/issue.entity';
import { User } from '../../users/entities/user.entity';

@Entity('issue_link')
export class IssueLink {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'source_issue_id', type: 'bigint' })
  sourceIssueId: string;

  @ManyToOne(() => Issue)
  @JoinColumn({ name: 'source_issue_id' })
  sourceIssue: Issue;

  @Column({ name: 'target_issue_id', type: 'bigint' })
  targetIssueId: string;

  @ManyToOne(() => Issue)
  @JoinColumn({ name: 'target_issue_id' })
  targetIssue: Issue;

  @Column({ name: 'link_type', length: 50 })
  linkType: string; // blocks, is_blocked_by, duplicates, is_duplicated_by, relates_to, etc.

  @Column({ name: 'creator_id', type: 'bigint' })
  creatorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
