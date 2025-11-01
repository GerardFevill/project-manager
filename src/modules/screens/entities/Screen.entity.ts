import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ScreenTab } from './ScreenTab.entity';

@Entity('screens')
export class Screen {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Default Screen' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'Default screen for all projects' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => ScreenTab, (tab) => tab.screen, { cascade: true })
  tabs: ScreenTab[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
