import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('cumulative_flow')
export class CumulativeFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  boardId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'jsonb' })
  statusCounts: Record<string, number>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
