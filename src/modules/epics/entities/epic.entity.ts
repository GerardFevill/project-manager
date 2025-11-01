import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('epics')
export class Epic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'varchar', nullable: true })
  initiativeId: string;

  @Column({ type: 'simple-array', nullable: true })
  storyIds: string[];

  @Column({ type: 'varchar', length: 50, default: 'to-do' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
