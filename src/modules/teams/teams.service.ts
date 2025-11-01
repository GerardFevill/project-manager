import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly memberRepository: Repository<TeamMember>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create({
      ...createTeamDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.teamRepository.save(team);
  }

  async findAll(projectId?: string): Promise<Team[]> {
    const query: any = { isActive: true };

    if (projectId) {
      query.projectId = projectId;
    }

    return this.teamRepository.find({
      where: query,
      relations: ['lead', 'members', 'members.user'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['lead', 'members', 'members.user'],
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  async update(id: string, updateData: Partial<CreateTeamDto>): Promise<Team> {
    const team = await this.findOne(id);

    Object.assign(team, updateData);
    team.updatedAt = new Date();

    return this.teamRepository.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    team.isActive = false;
    await this.teamRepository.save(team);
  }

  async addMember(teamId: string, addMemberDto: AddMemberDto): Promise<TeamMember> {
    const team = await this.findOne(teamId);

    // Check if user is already a member
    const existing = await this.memberRepository.findOne({
      where: { teamId, userId: addMemberDto.userId },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this team');
    }

    const member = this.memberRepository.create({
      teamId,
      userId: addMemberDto.userId,
      role: addMemberDto.role,
      joinedAt: new Date(),
    });

    return this.memberRepository.save(member);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { teamId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this team');
    }

    await this.memberRepository.remove(member);
  }

  async updateMemberRole(teamId: string, userId: string, role: string): Promise<TeamMember> {
    const member = await this.memberRepository.findOne({
      where: { teamId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this team');
    }

    member.role = role as any;
    return this.memberRepository.save(member);
  }

  async getUserTeams(userId: string): Promise<Team[]> {
    return this.teamRepository
      .createQueryBuilder('team')
      .innerJoin('team.members', 'member')
      .where('member.userId = :userId', { userId })
      .andWhere('team.isActive = :isActive', { isActive: true })
      .leftJoinAndSelect('team.lead', 'lead')
      .leftJoinAndSelect('team.members', 'members')
      .leftJoinAndSelect('members.user', 'user')
      .getMany();
  }
}
