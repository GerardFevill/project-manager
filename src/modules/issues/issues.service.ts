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

  // ========== BULK OPERATIONS ==========

  async createBulk(issues: CreateIssueDto[]): Promise<Issue[]> {
    const createdIssues: Issue[] = [];
    for (const issueDto of issues) {
      const issue = await this.create(issueDto);
      createdIssues.push(issue);
    }
    return createdIssues;
  }

  async updateBulk(issueIds: string[], updates: UpdateIssueDto): Promise<Issue[]> {
    const updatedIssues: Issue[] = [];
    for (const id of issueIds) {
      const issue = await this.update(id, updates);
      updatedIssues.push(issue);
    }
    return updatedIssues;
  }

  // ========== ISSUE ACTIONS ==========

  async assignIssue(id: string, assigneeId: string): Promise<Issue> {
    return this.update(id, { assigneeId });
  }

  async notifyIssue(id: string, userIds: string[], message?: string): Promise<{ notified: boolean; userCount: number }> {
    await this.findOne(id); // Verify issue exists
    // TODO: Implement actual notification sending
    return { notified: true, userCount: userIds.length };
  }

  async moveIssue(id: string, targetProjectId: string): Promise<Issue> {
    const issue = await this.findOne(id);
    const targetProject = await this.projectRepository.findOne({ where: { id: targetProjectId } });

    if (!targetProject) {
      throw new NotFoundException(`Target project ${targetProjectId} not found`);
    }

    // Generate new issue key for target project
    const count = await this.issueRepository.count({ where: { projectId: targetProjectId } });
    const newIssueKey = `${targetProject.projectKey}-${count + 1}`;

    issue.projectId = targetProjectId;
    issue.issueKey = newIssueKey;
    issue.updatedAt = new Date();

    return this.issueRepository.save(issue);
  }

  async cloneIssue(id: string, summary?: string, projectId?: string): Promise<Issue> {
    const originalIssue = await this.findOne(id);

    const cloneData: CreateIssueDto = {
      projectId: projectId || originalIssue.projectId,
      summary: summary || `Clone of ${originalIssue.summary}`,
      description: originalIssue.description,
      issueType: originalIssue.issueType,
      priority: originalIssue.priority,
      reporterId: originalIssue.reporterId,
      assigneeId: originalIssue.assigneeId,
    };

    return this.create(cloneData);
  }

  async archiveIssue(id: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = 'Archived';
    issue.updatedAt = new Date();
    return this.issueRepository.save(issue);
  }

  async restoreIssue(id: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = 'Open';
    issue.updatedAt = new Date();
    return this.issueRepository.save(issue);
  }

  // ========== SUBTASKS ==========

  async getSubtasks(id: string): Promise<Issue[]> {
    await this.findOne(id); // Verify parent exists
    return this.issueRepository.find({
      where: { parentId: id },
      relations: ['project', 'reporter', 'assignee'],
      order: { createdAt: 'ASC' },
    });
  }

  async createSubtask(parentId: string, dto: CreateIssueDto): Promise<Issue> {
    const parent = await this.findOne(parentId);

    const subtaskData: CreateIssueDto = {
      ...dto,
      projectId: parent.projectId,
      issueType: 'Sub-task',
    };

    const subtask = await this.create(subtaskData);
    subtask.parentId = parentId;
    return this.issueRepository.save(subtask);
  }

  // ========== REMOTE LINKS ==========

  async getRemoteLinks(id: string): Promise<any[]> {
    await this.findOne(id); // Verify issue exists
    // Remote links would be stored in a separate table
    return [];
  }

  async addRemoteLink(id: string, url: string, title: string): Promise<any> {
    await this.findOne(id); // Verify issue exists
    // TODO: Store in remote_links table
    return { id: 'link-' + Date.now(), issueId: id, url, title };
  }

  async removeRemoteLink(id: string, linkId: string): Promise<void> {
    await this.findOne(id); // Verify issue exists
    // TODO: Delete from remote_links table
  }

  // ========== METADATA ==========

  async getEditMeta(id: string): Promise<any> {
    const issue = await this.findOne(id);
    return {
      fields: {
        summary: { required: true, type: 'string', maxLength: 255 },
        description: { required: false, type: 'text' },
        issueType: { required: true, type: 'select', options: ['Task', 'Bug', 'Story', 'Epic'] },
        priority: { required: false, type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        assignee: { required: false, type: 'user' },
        status: { required: true, type: 'select', options: ['Open', 'In Progress', 'Resolved', 'Closed'] },
      },
    };
  }

  async getCreateMeta(projectId?: string): Promise<any> {
    if (projectId) {
      const project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }
    }

    return {
      projects: projectId ? [{ id: projectId }] : [],
      fields: {
        summary: { required: true, type: 'string', maxLength: 255 },
        description: { required: false, type: 'text' },
        issueType: { required: true, type: 'select', options: ['Task', 'Bug', 'Story', 'Epic', 'Sub-task'] },
        priority: { required: false, type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] },
        assignee: { required: false, type: 'user' },
        reporter: { required: true, type: 'user' },
      },
    };
  }

  async getPickerSuggestions(query: string, currentIssueKey?: string): Promise<any> {
    const issues = await this.issueRepository
      .createQueryBuilder('issue')
      .where('issue.summary LIKE :query OR issue.issueKey LIKE :query', { query: `%${query}%` })
      .andWhere('issue.issueKey != :currentIssueKey', { currentIssueKey: currentIssueKey || '' })
      .take(10)
      .getMany();

    return {
      sections: [
        {
          label: 'Recent Issues',
          issues: issues.map(issue => ({
            id: issue.id,
            key: issue.issueKey,
            summary: issue.summary,
            img: null,
          })),
        },
      ],
    };
  }
}
