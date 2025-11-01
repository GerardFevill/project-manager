import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('priorities')
export class Priority {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'High' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: 'High priority issues' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ example: '#FF0000' })
  @Column({ type: 'varchar', length: 7, default: '#000000' })
  iconColor: string;

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
