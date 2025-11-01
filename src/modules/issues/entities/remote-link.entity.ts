import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Issue } from './issue.entity';

/**
 * RemoteLink Entity
 * Represents external links attached to an issue (e.g., GitHub PR, Confluence page, etc.)
 */
@Entity('issue_remote_links')
export class RemoteLink {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '12345' })
  @Column({ name: 'issue_id', type: 'bigint' })
  issueId: string;

  @ManyToOne(() => Issue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @ApiProperty({ example: 'https://github.com/org/repo/pull/123' })
  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @ApiProperty({ example: 'Fix authentication bug' })
  @Column({ type: 'varchar', length: 500 })
  title: string;

  @ApiProperty({ example: 'GitHub Pull Request #123', required: false })
  @Column({ type: 'text', nullable: true })
  summary?: string;

  @ApiProperty({ example: 'github', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  relationship?: string;

  @ApiProperty({ example: 'https://github.com/favicon.ico', required: false })
  @Column({ type: 'varchar', length: 2048, nullable: true })
  iconUrl?: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
