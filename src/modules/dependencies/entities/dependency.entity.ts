import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('dependencies')
export class Dependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  sourceProjectId: string;

  @Column({ type: 'varchar' })
  targetProjectId: string;

  @Column({ type: 'varchar', length: 50, default: 'blocks' })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
