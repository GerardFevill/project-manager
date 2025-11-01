import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('burn_charts')
export class BurnData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  sprintId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  remainingWork: number;

  @Column({ type: 'int' })
  idealRemaining: number;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'burndown' or 'burnup'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
