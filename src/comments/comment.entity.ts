import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Comment Entity - Jira-style comments for issues
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  // Issue relationship
  @Column({ type: 'uuid' })
  issueId: string;

  @ManyToOne('Issue', 'comments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issueId' })
  issue: any;

  // Author relationship
  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne('User', 'comments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: any;

  // Edit tracking
  @Column({ default: false })
  isEdited: boolean;

  @Column({ type: 'timestamp', nullable: true })
  editedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
