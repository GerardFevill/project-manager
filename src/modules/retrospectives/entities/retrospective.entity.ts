import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('retrospectives')
export class Retrospective {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  sprintId: string;

  @Column({ type: 'jsonb', nullable: true })
  wentWell: string[];

  @Column({ type: 'jsonb', nullable: true })
  toImprove: string[];

  @Column({ type: 'jsonb', nullable: true })
  actionItems: any[];

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
