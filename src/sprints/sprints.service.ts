import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';
import { Issue } from '../issues/entities/issue.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintStatus } from './enums/sprint-status.enum';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const sprint = this.sprintRepository.create(createSprintDto);
    return await this.sprintRepository.save(sprint);
  }

  async findAll(params?: {
    status?: SprintStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Sprint[]; meta: any }> {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.sprintRepository
      .createQueryBuilder('sprint')
      .orderBy('sprint.created', 'DESC');

    if (params?.status) {
      queryBuilder.andWhere('sprint.status = :status', {
        status: params.status,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({ where: { id } });
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async findActiveSprint(): Promise<Sprint | null> {
    return await this.sprintRepository.findOne({
      where: { status: SprintStatus.ACTIVE },
    });
  }

  async update(id: number, updateSprintDto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id);

    // If trying to set status to ACTIVE, check no other sprint is active
    if (
      updateSprintDto.status === SprintStatus.ACTIVE &&
      sprint.status !== SprintStatus.ACTIVE
    ) {
      const activeSprint = await this.findActiveSprint();
      if (activeSprint && activeSprint.id !== id) {
        throw new ConflictException(
          `Cannot activate sprint. Sprint "${activeSprint.name}" is already active.`,
        );
      }
    }

    Object.assign(sprint, updateSprintDto);
    return await this.sprintRepository.save(sprint);
  }

  async remove(id: number): Promise<void> {
    const sprint = await this.findOne(id);
    await this.sprintRepository.remove(sprint);
  }

  async startSprint(id: number): Promise<Sprint> {
    return await this.update(id, { status: SprintStatus.ACTIVE });
  }

  async completeSprint(id: number): Promise<Sprint> {
    return await this.update(id, { status: SprintStatus.COMPLETED });
  }

  async getSprintIssues(id: number): Promise<Issue[]> {
    // Verify sprint exists
    await this.findOne(id);

    return await this.issueRepository.find({
      where: { sprintId: id },
      order: { created: 'ASC' },
    });
  }

  async getSprintDetails(id: number): Promise<Sprint & { issues: Issue[] }> {
    const sprint = await this.findOne(id);
    const issues = await this.getSprintIssues(id);

    return {
      ...sprint,
      issues,
    };
  }

  async assignIssueToSprint(
    sprintId: number,
    issueId: string,
  ): Promise<{ message: string; issue: Issue }> {
    // Verify sprint exists
    await this.findOne(sprintId);

    const issue = await this.issueRepository.findOne({ where: { id: issueId } });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${issueId} not found`);
    }

    issue.sprintId = sprintId;
    const updatedIssue = await this.issueRepository.save(issue);

    return {
      message: 'Issue assigned to sprint successfully',
      issue: updatedIssue,
    };
  }

  async removeIssueFromSprint(
    sprintId: number,
    issueId: string,
  ): Promise<{ message: string; issue: Issue }> {
    const issue = await this.issueRepository.findOne({ where: { id: issueId } });
    if (!issue) {
      throw new NotFoundException(`Issue with ID ${issueId} not found`);
    }

    if (issue.sprintId !== sprintId) {
      throw new ConflictException(
        `Issue ${issueId} is not in sprint ${sprintId}`,
      );
    }

    issue.sprintId = null;
    const updatedIssue = await this.issueRepository.save(issue);

    return {
      message: 'Issue removed from sprint successfully',
      issue: updatedIssue,
    };
  }
}
