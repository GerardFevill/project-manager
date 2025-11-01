import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity('sprint')
export class Sprint {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'sprint_name', length: 255 })
  sprintName: string;

  @Column({ name: 'board_id', type: 'bigint' })
  boardId: string;

  @ManyToOne(() => Board)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Column({ name: 'sprint_goal', type: 'text', nullable: true })
  sprintGoal: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ name: 'status', length: 50, default: 'Future' })
  status: string;

  @Column({ name: 'sequence', type: 'int', nullable: true })
  sequence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}
