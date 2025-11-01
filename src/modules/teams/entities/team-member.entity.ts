import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { User } from '../../users/user.entity';

export enum TeamRole {
  MEMBER = 'member',
  SCRUM_MASTER = 'scrum_master',
  PRODUCT_OWNER = 'product_owner',
  TECH_LEAD = 'tech_lead',
}

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  teamId: string;

  @ManyToOne(() => Team, team => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: TeamRole.MEMBER })
  role: TeamRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
