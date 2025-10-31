import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Link Type - Types of relationships between issues
 */
export enum LinkType {
  BLOCKS = 'blocks',
  IS_BLOCKED_BY = 'is_blocked_by',
  RELATES_TO = 'relates_to',
  DUPLICATES = 'duplicates',
  IS_DUPLICATED_BY = 'is_duplicated_by',
  CLONES = 'clones',
  IS_CLONED_BY = 'is_cloned_by',
  CAUSES = 'causes',
  IS_CAUSED_BY = 'is_caused_by',
}

/**
 * ISSUE LINK - Jira Issue Link
 *
 * Represents relationships between issues:
 * - blocks / is blocked by
 * - relates to
 * - duplicates / is duplicated by
 * - etc.
 */
@Entity('issue_links')
export class IssueLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Type of link
   */
  @Column({
    type: 'enum',
    enum: LinkType,
  })
  linkType: LinkType;

  /**
   * Source issue (outward link)
   */
  @Column({ type: 'uuid' })
  sourceIssueId: string;

  @ManyToOne('Issue', 'outwardLinks', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sourceIssueId' })
  sourceIssue: any;

  /**
   * Target issue (inward link)
   */
  @Column({ type: 'uuid' })
  targetIssueId: string;

  @ManyToOne('Issue', 'inwardLinks', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'targetIssueId' })
  targetIssue: any;

  /**
   * User who created this link
   */
  @Column({ type: 'uuid', nullable: true })
  createdById: string;

  @ManyToOne('User', {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'createdById' })
  createdBy: any;

  @CreateDateColumn()
  createdAt: Date;
}
