import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('slas')
export class SLA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar' })
  projectId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  priority: string; // 'Highest', 'High', 'Medium', 'Low'

  @Column({ type: 'int' })
  responseTimeMinutes: number; // Time to first response

  @Column({ type: 'int' })
  resolutionTimeMinutes: number; // Time to resolution

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
