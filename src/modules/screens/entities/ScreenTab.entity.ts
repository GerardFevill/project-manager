import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Screen } from './Screen.entity';

@Entity('screen_tabs')
export class ScreenTab {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Field Tab' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 1 })
  @Column({ type: 'int', default: 0 })
  position: number;

  @Column({ type: 'uuid' })
  screenId: string;

  @ManyToOne(() => Screen, (screen) => screen.tabs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'screenId' })
  screen: Screen;

  @ApiProperty({ example: ['summary', 'description', 'assignee'] })
  @Column({ type: 'simple-array', default: '' })
  fields: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
