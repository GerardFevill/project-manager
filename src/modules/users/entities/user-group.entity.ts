import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_group')
export class UserGroup {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'group_name', unique: true, length: 255 })
  groupName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}
