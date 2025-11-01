import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ name: 'is_system_role', default: false })
  isSystemRole: boolean;

  @Column({ type: 'simple-array', nullable: true })
  permissions: string[]; // Array of permission strings

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
