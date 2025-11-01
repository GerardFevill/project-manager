import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('velocity_tracking')
export class Velocity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  teamId: string;

  @Column({ type: 'varchar' })
  sprintId: string;

  @Column({ type: 'int' })
  committed: number;

  @Column({ type: 'int' })
  completed: number;

  @Column({ type: 'float' })
  velocity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
