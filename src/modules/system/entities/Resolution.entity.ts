import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('resolutions')
export class Resolution {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Fixed' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'A fix for this issue is checked into the tree and tested' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', default: 0 })
  sequence: number;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
