import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('application_properties')
export class ApplicationProperty {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'jira.timetracking.hours.per.day' })
  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @ApiProperty({ example: '8' })
  @Column({ type: 'text' })
  value: string;

  @ApiProperty({ example: 'Time Tracking' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @ApiProperty({ example: 'Number of working hours per day' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'number' })
  @Column({ type: 'varchar', length: 50, default: 'string' })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
