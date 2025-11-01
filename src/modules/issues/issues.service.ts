import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, projectId?: string): Promise<{ data: Issue[]; total: number; page: number; lastPage: number }> {
    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.project', 'project')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .orderBy('issue.createdAt', 'DESC');

    if (projectId) {
      queryBuilder.where('issue.projectId = :projectId', { projectId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['project', 'reporter', 'assignee'],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return issue;
  }

  async findByKey(issueKey: string): Promise<Issue | null> {
    return this.issueRepository.findOne({
      where: { issueKey },
      relations: ['project', 'reporter', 'assignee'],
    });
  }

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const { projectId, ...issueData } = createIssueDto;

    // Verify project exists
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestException(`Project with ID ${projectId} not found`);
    }

    // Generate issue key
    const count = await this.issueRepository.count({ where: { projectId } });
    const issueKey = `${project.projectKey}-${count + 1}`;

    const issue = this.issueRepository.create({
      ...issueData,
      projectId,
      issueKey,
      status: 'Open',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.issueRepository.save(issue);
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.findOne(id);

    Object.assign(issue, updateIssueDto);
    issue.updatedAt = new Date();

    // If status is resolved, set resolvedAt
    if (updateIssueDto.status === 'Resolved' && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
    }

    return this.issueRepository.save(issue);
  }

  async remove(id: string): Promise<void> {
    const issue = await this.findOne(id);
    await this.issueRepository.remove(issue);
  }

  async findByProject(projectId: string): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { projectId },
      relations: ['project', 'reporter', 'assignee'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAssignee(assigneeId: string): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { assigneeId },
      relations: ['project', 'reporter', 'assignee'],
      order: { createdAt: 'DESC' },
    });
  }
}
