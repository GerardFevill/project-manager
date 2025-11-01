import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('initiatives')
export class Initiative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  portfolioId: string;

  @Column({ type: 'simple-array', nullable: true })
  epicIds: string[];

  @Column({ type: 'varchar', length: 50, default: 'proposed' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  objectives: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
