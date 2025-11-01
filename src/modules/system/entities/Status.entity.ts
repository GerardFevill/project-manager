import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('statuses')
export class Status {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'In Progress' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'The issue is being actively worked on' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 'TODO' })
  @Column({ type: 'varchar', length: 50, default: 'TODO' })
  category: string;

  @ApiProperty({ example: '#0052CC' })
  @Column({ type: 'varchar', length: 7, default: '#000000' })
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
