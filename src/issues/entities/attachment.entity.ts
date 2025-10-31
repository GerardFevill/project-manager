import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * ATTACHMENT - Jira Attachment
 *
 * Files attached to issues
 */
@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Original filename
   */
  @Column({ length: 255 })
  filename: string;

  /**
   * File path or URL
   */
  @Column({ type: 'text' })
  filePath: string;

  /**
   * MIME type
   */
  @Column({ length: 100 })
  mimeType: string;

  /**
   * File size in bytes
   */
  @Column({ type: 'bigint' })
  fileSize: number;

  /**
   * Issue this attachment belongs to
   */
  @Column({ type: 'uuid' })
  issueId: string;

  @ManyToOne('Issue', 'attachments', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issueId' })
  issue: any;

  /**
   * User who uploaded this attachment
   */
  @Column({ type: 'uuid' })
  uploadedById: string;

  @ManyToOne('User', {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: any;

  @CreateDateColumn()
  createdAt: Date;
}
