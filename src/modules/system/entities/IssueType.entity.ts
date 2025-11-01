import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('issue_types')
export class IssueType {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Bug' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'A problem which impairs or prevents functions' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'bug-icon' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  iconUrl?: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: false })
  subtask: boolean;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
