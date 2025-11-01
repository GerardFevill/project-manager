import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { RemoteLink } from './entities/remote-link.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Project } from '../projects/entities/project.entity';

/**
 * IssuesService
 *
 * Service complet pour la gestion des issues avec toutes les fonctionnalités Jira:
 * - CRUD de base
 * - Opérations en masse (bulk)
 * - Actions sur les issues (assign, move, clone, archive)
 * - Sous-tâches (subtasks)
 * - Liens distants (remote links)
 * - Métadonnées (editmeta, createmeta, picker)
 */
@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(RemoteLink)
    private readonly remoteLinkRepository: Repository<RemoteLink>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // ==================== CRUD DE BASE ====================

  /**
   * Récupère toutes les issues avec pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    projectId?: string,
  ): Promise<{ data: Issue[]; total: number; page: number; lastPage: number }> {
    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.project', 'project')
      .leftJoinAndSelect('issue.reporter', 'reporter')
      .leftJoinAndSelect('issue.assignee', 'assignee')
      .leftJoinAndSelect('issue.labels', 'labels')
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

  /**
   * Récupère une issue par son ID
   */
  async findOne(id: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['project', 'reporter', 'assignee', 'labels', 'subtasks'],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return issue;
  }

  /**
   * Récupère une issue par sa clé (ex: PROJ-123)
   */
  async findByKey(issueKey: string): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { issueKey },
      relations: ['project', 'reporter', 'assignee', 'labels', 'subtasks'],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with key ${issueKey} not found`);
    }

    return issue;
  }

  /**
   * Crée une nouvelle issue
   */
  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const { projectId, ...issueData } = createIssueDto;

    // Vérifier que le projet existe
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestException(`Project with ID ${projectId} not found`);
    }

    // Générer la clé de l'issue (ex: PROJ-123)
    const count = await this.issueRepository.count({ where: { projectId } });
    const issueKey = `${project.projectKey}-${count + 1}`;

    // Créer l'issue
    const issue = this.issueRepository.create({
      ...issueData,
      projectId,
      issueKey,
      priority: issueData.priority || 'Medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.issueRepository.save(issue);
  }

  /**
   * Met à jour une issue
   */
  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const issue = await this.findOne(id);

    Object.assign(issue, updateIssueDto);
    issue.updatedAt = new Date();

    // Si le statut passe à "Resolved", mettre à jour resolvedAt
    if (updateIssueDto.status === 'Resolved' && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
    }

    // Si le statut n'est plus "Resolved", réinitialiser resolvedAt
    if (updateIssueDto.status && updateIssueDto.status !== 'Resolved' && issue.resolvedAt) {
      issue.resolvedAt = null;
    }

    return this.issueRepository.save(issue);
  }

  /**
   * Supprime une issue
   */
  async remove(id: string): Promise<void> {
    const issue = await this.findOne(id);
    await this.issueRepository.remove(issue);
  }

  /**
   * Récupère toutes les issues d'un projet
   */
  async findByProject(projectId: string): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { projectId },
      relations: ['project', 'reporter', 'assignee', 'labels'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère toutes les issues assignées à un utilisateur
   */
  async findByAssignee(assigneeId: string): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { assigneeId },
      relations: ['project', 'reporter', 'assignee', 'labels'],
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== OPÉRATIONS EN MASSE ====================

  /**
   * Crée plusieurs issues en une seule fois
   */
  async createBulk(issues: CreateIssueDto[]): Promise<Issue[]> {
    const createdIssues: Issue[] = [];

    for (const issueDto of issues) {
      try {
        const issue = await this.create(issueDto);
        createdIssues.push(issue);
      } catch (error) {
        // Log l'erreur mais continue avec les autres issues
        console.error(`Failed to create issue: ${error.message}`);
      }
    }

    return createdIssues;
  }

  /**
   * Met à jour plusieurs issues en une seule fois
   */
  async updateBulk(issueIds: string[], updates: UpdateIssueDto): Promise<Issue[]> {
    const updatedIssues: Issue[] = [];

    for (const id of issueIds) {
      try {
        const issue = await this.update(id, updates);
        updatedIssues.push(issue);
      } catch (error) {
        console.error(`Failed to update issue ${id}: ${error.message}`);
      }
    }

    return updatedIssues;
  }

  // ==================== ACTIONS SUR LES ISSUES ====================

  /**
   * Assigne une issue à un utilisateur
   */
  async assignIssue(id: string, assigneeId: string): Promise<Issue> {
    return this.update(id, { assigneeId });
  }

  /**
   * Envoie des notifications pour une issue
   */
  async notifyIssue(
    id: string,
    userIds: string[],
    message?: string,
  ): Promise<{ notified: boolean; userCount: number; message?: string }> {
    const issue = await this.findOne(id);

    // TODO: Implémenter l'envoi réel de notifications
    // Pour l'instant, on retourne juste un succès
    return {
      notified: true,
      userCount: userIds.length,
      message: message || `Notification sent for issue ${issue.issueKey}`,
    };
  }

  /**
   * Déplace une issue vers un autre projet
   */
  async moveIssue(id: string, targetProjectId: string): Promise<Issue> {
    const issue = await this.findOne(id);
    const targetProject = await this.projectRepository.findOne({
      where: { id: targetProjectId },
    });

    if (!targetProject) {
      throw new NotFoundException(`Target project ${targetProjectId} not found`);
    }

    // Générer une nouvelle clé pour le projet cible
    const count = await this.issueRepository.count({
      where: { projectId: targetProjectId },
    });
    const newIssueKey = `${targetProject.projectKey}-${count + 1}`;

    issue.projectId = targetProjectId;
    issue.issueKey = newIssueKey;
    issue.updatedAt = new Date();

    return this.issueRepository.save(issue);
  }

  /**
   * Clone une issue (crée une copie)
   */
  async cloneIssue(id: string, summary?: string, projectId?: string): Promise<Issue> {
    const originalIssue = await this.findOne(id);

    const cloneData: CreateIssueDto = {
      projectId: projectId || originalIssue.projectId,
      summary: summary || `[CLONE] ${originalIssue.summary}`,
      description: originalIssue.description,
      issueType: originalIssue.issueType,
      priority: originalIssue.priority,
      reporterId: originalIssue.reporterId,
      assigneeId: originalIssue.assigneeId,
      dueDate: originalIssue.dueDate ? originalIssue.dueDate.toISOString().split('T')[0] : undefined,
      originalEstimate: originalIssue.originalEstimate,
    };

    return this.create(cloneData);
  }

  /**
   * Archive une issue
   */
  async archiveIssue(id: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = 'Archived';
    issue.updatedAt = new Date();
    return this.issueRepository.save(issue);
  }

  /**
   * Restaure une issue archivée
   */
  async restoreIssue(id: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = 'Open';
    issue.updatedAt = new Date();
    return this.issueRepository.save(issue);
  }

  // ==================== SOUS-TÂCHES (SUBTASKS) ====================

  /**
   * Récupère toutes les sous-tâches d'une issue
   */
  async getSubtasks(id: string): Promise<Issue[]> {
    const parent = await this.findOne(id);

    return this.issueRepository.find({
      where: { parentId: id },
      relations: ['project', 'reporter', 'assignee', 'labels'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Crée une sous-tâche pour une issue
   */
  async createSubtask(parentId: string, dto: CreateIssueDto): Promise<Issue> {
    const parent = await this.findOne(parentId);

    // Créer la sous-tâche avec le même projet que le parent
    const subtaskData: CreateIssueDto = {
      ...dto,
      projectId: parent.projectId,
      issueType: 'Sub-task',
    };

    const subtask = await this.create(subtaskData);

    // Lier au parent
    subtask.parentId = parentId;
    return this.issueRepository.save(subtask);
  }

  // ==================== LIENS DISTANTS (REMOTE LINKS) ====================

  /**
   * Récupère tous les liens distants d'une issue
   */
  async getRemoteLinks(id: string): Promise<RemoteLink[]> {
    const issue = await this.findOne(id);

    return this.remoteLinkRepository.find({
      where: { issueId: id, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Ajoute un lien distant à une issue
   */
  async addRemoteLink(id: string, url: string, title: string): Promise<RemoteLink> {
    const issue = await this.findOne(id);

    const remoteLink = this.remoteLinkRepository.create({
      issueId: id,
      url,
      title,
      isActive: true,
      createdAt: new Date(),
    });

    return this.remoteLinkRepository.save(remoteLink);
  }

  /**
   * Supprime un lien distant
   */
  async removeRemoteLink(id: string, linkId: string): Promise<void> {
    const issue = await this.findOne(id);

    const remoteLink = await this.remoteLinkRepository.findOne({
      where: { id: linkId, issueId: id },
    });

    if (!remoteLink) {
      throw new NotFoundException(`Remote link ${linkId} not found for issue ${id}`);
    }

    await this.remoteLinkRepository.remove(remoteLink);
  }

  // ==================== MÉTADONNÉES ====================

  /**
   * Récupère les métadonnées d'édition d'une issue
   */
  async getEditMeta(id: string): Promise<any> {
    const issue = await this.findOne(id);

    return {
      fields: {
        summary: {
          required: true,
          type: 'string',
          maxLength: 500,
          operations: ['set'],
        },
        description: {
          required: false,
          type: 'text',
          operations: ['set'],
        },
        issueType: {
          required: true,
          type: 'select',
          allowedValues: ['Task', 'Bug', 'Story', 'Epic', 'Sub-task'],
          operations: ['set'],
        },
        priority: {
          required: false,
          type: 'select',
          allowedValues: ['Low', 'Medium', 'High', 'Critical'],
          operations: ['set'],
        },
        status: {
          required: true,
          type: 'select',
          allowedValues: ['Open', 'In Progress', 'Resolved', 'Closed', 'Archived'],
          operations: ['set'],
        },
        assignee: {
          required: false,
          type: 'user',
          operations: ['set'],
        },
        reporter: {
          required: true,
          type: 'user',
          operations: ['set'],
        },
        dueDate: {
          required: false,
          type: 'date',
          operations: ['set'],
        },
      },
    };
  }

  /**
   * Récupère les métadonnées de création d'issues
   */
  async getCreateMeta(projectId?: string): Promise<any> {
    if (projectId) {
      const project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }
    }

    return {
      projects: projectId
        ? [
            {
              id: projectId,
              key: (await this.projectRepository.findOne({ where: { id: projectId } }))
                ?.projectKey,
            },
          ]
        : [],
      fields: {
        summary: {
          required: true,
          type: 'string',
          maxLength: 500,
        },
        description: {
          required: false,
          type: 'text',
        },
        issueType: {
          required: true,
          type: 'select',
          allowedValues: ['Task', 'Bug', 'Story', 'Epic', 'Sub-task'],
        },
        priority: {
          required: false,
          type: 'select',
          allowedValues: ['Low', 'Medium', 'High', 'Critical'],
          defaultValue: 'Medium',
        },
        assignee: {
          required: false,
          type: 'user',
        },
        reporter: {
          required: true,
          type: 'user',
        },
        dueDate: {
          required: false,
          type: 'date',
        },
      },
    };
  }

  /**
   * Récupère des suggestions d'issues pour le picker
   */
  async getPickerSuggestions(query: string, currentIssueKey?: string): Promise<any> {
    const queryBuilder = this.issueRepository
      .createQueryBuilder('issue')
      .leftJoinAndSelect('issue.project', 'project')
      .where('issue.summary LIKE :query OR issue.issueKey LIKE :query', {
        query: `%${query}%`,
      });

    if (currentIssueKey) {
      queryBuilder.andWhere('issue.issueKey != :currentIssueKey', { currentIssueKey });
    }

    const issues = await queryBuilder.take(10).getMany();

    return {
      sections: [
        {
          label: 'Recent Issues',
          issues: issues.map((issue) => ({
            id: issue.id,
            key: issue.issueKey,
            summary: issue.summary,
            img: null,
            summaryText: issue.summary,
          })),
        },
      ],
    };
  }
}
