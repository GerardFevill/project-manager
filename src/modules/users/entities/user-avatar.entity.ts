import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_avatars')
export class UserAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500 })
  avatarUrl: string;

  @Column({ name: 'avatar_type', type: 'varchar', length: 50, default: 'uploaded' })
  avatarType: string;

  @Column({ name: 'file_size', type: 'integer', nullable: true })
  fileSize: number;

  @Column({ name: 'mime_type', type: 'varchar', length: 100, nullable: true })
  mimeType: string;

  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;
}
