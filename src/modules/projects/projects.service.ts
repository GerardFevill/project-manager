import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectRoleActor } from './entities/project-role-actor.entity';
import { ProjectFeature } from './entities/project-feature.entity';
import { ProjectAvatar } from './entities/project-avatar.entity';
import { IssueStatistics } from './entities/issue-statistics.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * ProjectsService
 *
 * Service complet pour la gestion des projets avec toutes les fonctionnalités Jira:
 * - CRUD de base
 * - Gestion d'archivage
 * - Utilisateurs et rôles du projet
 * - Configuration du projet (schemes, features)
 * - Recherche et métadonnées
 * - Avatar et hiérarchie
 * - Validation
 */
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(ProjectRoleActor)
    private readonly projectRoleActorRepository: Repository<ProjectRoleActor>,
    @InjectRepository(ProjectFeature)
    private readonly projectFeatureRepository: Repository<ProjectFeature>,
    @InjectRepository(ProjectAvatar)
    private readonly projectAvatarRepository: Repository<ProjectAvatar>,
    @InjectRepository(IssueStatistics)
    private readonly issueStatisticsRepository: Repository<IssueStatistics>,
  ) {}

  // ==================== CRUD DE BASE ====================

  /**
   * Récupère tous les projets avec pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Project[]; total: number; page: number; lastPage: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['lead'],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Récupère un projet par son ID
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  /**
   * Récupère un projet par sa clé (ex: PROJ)
   */
  async findByKey(projectKey: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { projectKey },
      relations: ['lead'],
    });

    if (!project) {
      throw new NotFoundException(`Project with key ${projectKey} not found`);
    }

    return project;
  }

  /**
   * Crée un nouveau projet
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Vérifier que la clé du projet n'existe pas déjà
    const existingProject = await this.projectRepository.findOne({
      where: { projectKey: createProjectDto.projectKey },
    });

    if (existingProject) {
      throw new ConflictException(
        `Project with key ${createProjectDto.projectKey} already exists`,
      );
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.projectRepository.save(project);
  }

  /**
   * Met à jour un projet
   */
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    Object.assign(project, updateProjectDto);
    project.updatedAt = new Date();

    return this.projectRepository.save(project);
  }

  /**
   * Supprime un projet
   */
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  /**
   * Archive un projet
   */
  async archive(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isArchived = true;
    project.updatedAt = new Date();
    return this.projectRepository.save(project);
  }

  /**
   * Désarchive un projet
   */
  async unarchive(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isArchived = false;
    project.updatedAt = new Date();
    return this.projectRepository.save(project);
  }

  // ==================== UTILISATEURS & RÔLES ====================

  /**
   * Récupère tous les utilisateurs d'un projet
   */
  async getProjectUsers(id: string): Promise<any> {
    const project = await this.findOne(id);

    const projectUsers = await this.projectUserRepository.find({
      where: { projectId: id },
      relations: ['user'],
      order: { addedAt: 'ASC' },
    });

    return {
      projectId: id,
      projectKey: project.projectKey,
      users: projectUsers.map(pu => ({
        userId: pu.userId,
        username: pu.user?.username,
        role: pu.role,
        addedAt: pu.addedAt,
        addedBy: pu.addedBy,
      })),
    };
  }

  /**
   * Récupère les acteurs d'un rôle de projet
   */
  async getRoleActors(projectId: string, roleId: string): Promise<any> {
    const project = await this.findOne(projectId);

    const actors = await this.projectRoleActorRepository.find({
      where: { projectId, roleId },
      order: { addedAt: 'DESC' },
    });

    return {
      projectId,
      roleId,
      actors: actors.map(actor => ({
        actorId: actor.actorId,
        actorType: actor.actorType,
        name: actor.actorName,
        addedAt: actor.addedAt,
      })),
    };
  }

  /**
   * Ajoute un acteur à un rôle de projet
   */
  async addRoleActor(
    projectId: string,
    roleId: string,
    actorData: { actorId: string; actorType: 'user' | 'group'; actorName?: string },
  ): Promise<any> {
    const project = await this.findOne(projectId);

    const actor = this.projectRoleActorRepository.create({
      projectId,
      roleId,
      actorId: actorData.actorId,
      actorType: actorData.actorType,
      actorName: actorData.actorName,
    });

    await this.projectRoleActorRepository.save(actor);

    return {
      projectId,
      roleId,
      actor: {
        actorId: actor.actorId,
        actorType: actor.actorType,
        name: actor.actorName,
        addedAt: actor.addedAt,
      },
    };
  }

  /**
   * Retire un acteur d'un rôle de projet
   */
  async removeRoleActor(
    projectId: string,
    roleId: string,
    actorId: string,
  ): Promise<void> {
    const project = await this.findOne(projectId);

    const actor = await this.projectRoleActorRepository.findOne({
      where: { projectId, roleId, actorId },
    });

    if (actor) {
      await this.projectRoleActorRepository.remove(actor);
    }
  }

  // ==================== CONFIGURATION DU PROJET ====================

  /**
   * Récupère le schéma de sécurité des issues du projet
   */
  async getIssueSecurityLevelScheme(id: string): Promise<any> {
    const project = await this.findOne(id);

    return {
      projectId: id,
      scheme: null, // TODO: Lier avec la table issue_security_schemes
      defaultLevel: null,
    };
  }

  /**
   * Récupère le schéma de notifications du projet
   */
  async getNotificationScheme(id: string): Promise<any> {
    const project = await this.findOne(id);

    return {
      projectId: id,
      schemeId: null, // TODO: Lier avec notification_schemes
      schemeName: 'Default Notification Scheme',
    };
  }

  /**
   * Récupère le schéma de permissions du projet
   */
  async getPermissionScheme(id: string): Promise<any> {
    const project = await this.findOne(id);

    return {
      projectId: id,
      schemeId: null, // TODO: Lier avec permission_schemes
      schemeName: 'Default Permission Scheme',
      permissions: [],
    };
  }

  /**
   * Récupère les fonctionnalités activées du projet
   */
  async getProjectFeatures(id: string): Promise<any> {
    const project = await this.findOne(id);

    const features = await this.projectFeatureRepository.find({
      where: { projectId: id },
      order: { featureKey: 'ASC' },
    });

    const featuresObj: Record<string, { enabled: boolean; configuration?: any }> = {};

    if (features.length === 0) {
      // Fonctionnalités par défaut si aucune n'est définie
      return {
        projectId: id,
        features: {
          boards: { enabled: true },
          sprints: { enabled: true },
          backlog: { enabled: true },
          reports: { enabled: true },
          pages: { enabled: false },
          roadmap: { enabled: true },
          releases: { enabled: true },
        },
      };
    }

    features.forEach(feature => {
      featuresObj[feature.featureKey] = {
        enabled: feature.enabled,
        configuration: feature.configuration,
      };
    });

    return {
      projectId: id,
      features: featuresObj,
    };
  }

  /**
   * Met à jour les fonctionnalités du projet
   */
  async updateProjectFeatures(
    id: string,
    features: Record<string, { enabled: boolean; configuration?: any }>,
  ): Promise<any> {
    const project = await this.findOne(id);

    // Mettre à jour ou créer chaque fonctionnalité
    for (const [featureKey, featureData] of Object.entries(features)) {
      let feature = await this.projectFeatureRepository.findOne({
        where: { projectId: id, featureKey },
      });

      if (feature) {
        feature.enabled = featureData.enabled;
        feature.configuration = featureData.configuration || null;
        feature.updatedAt = new Date();
      } else {
        feature = this.projectFeatureRepository.create({
          projectId: id,
          featureKey,
          enabled: featureData.enabled,
          configuration: featureData.configuration,
        });
      }

      await this.projectFeatureRepository.save(feature);
    }

    return {
      projectId: id,
      features,
      updatedAt: new Date(),
    };
  }

  // ==================== RECHERCHE & MÉTADONNÉES ====================

  /**
   * Recherche de projets
   */
  async searchProjects(query: string): Promise<Project[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectName LIKE :query', { query: `%${query}%` })
      .orWhere('project.projectKey LIKE :query', { query: `%${query}%` })
      .orWhere('project.description LIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('project.lead', 'lead')
      .orderBy('project.projectName', 'ASC')
      .take(20)
      .getMany();
  }

  /**
   * Récupère l'avatar du projet
   */
  async getProjectAvatar(id: string): Promise<any> {
    const project = await this.findOne(id);

    const avatar = await this.projectAvatarRepository.findOne({
      where: { projectId: id },
    });

    return {
      projectId: id,
      avatarUrl: avatar?.avatarUrl || null,
      avatarType: avatar?.avatarType || 'default',
      fileSize: avatar?.fileSize,
      mimeType: avatar?.mimeType,
      uploadedAt: avatar?.uploadedAt,
    };
  }

  /**
   * Upload un avatar pour le projet
   */
  async uploadProjectAvatar(
    id: string,
    avatarData: { url: string; fileSize?: number; mimeType?: string },
  ): Promise<any> {
    const project = await this.findOne(id);

    let avatar = await this.projectAvatarRepository.findOne({
      where: { projectId: id },
    });

    if (avatar) {
      avatar.avatarUrl = avatarData.url;
      avatar.avatarType = 'uploaded';
      avatar.fileSize = avatarData.fileSize || null;
      avatar.mimeType = avatarData.mimeType || null;
      avatar.uploadedAt = new Date();
    } else {
      avatar = this.projectAvatarRepository.create({
        projectId: id,
        avatarUrl: avatarData.url,
        avatarType: 'uploaded',
        fileSize: avatarData.fileSize,
        mimeType: avatarData.mimeType,
      });
    }

    await this.projectAvatarRepository.save(avatar);

    return {
      projectId: id,
      avatarUrl: avatar.avatarUrl,
      uploadedAt: avatar.uploadedAt,
    };
  }

  /**
   * Récupère la hiérarchie du projet
   */
  async getProjectHierarchy(id: string): Promise<any> {
    const project = await this.findOne(id);

    // TODO: Implémenter la hiérarchie (épics -> stories -> subtasks)
    return {
      projectId: id,
      projectKey: project.projectKey,
      hierarchy: [
        { level: 0, type: 'Epic', enabled: true },
        { level: 1, type: 'Story', enabled: true },
        { level: 2, type: 'Task', enabled: true },
        { level: 3, type: 'Sub-task', enabled: true },
      ],
    };
  }

  /**
   * Récupère les insights/statistiques du projet
   */
  async getProjectInsights(id: string): Promise<any> {
    const project = await this.findOne(id);

    let statistics = await this.issueStatisticsRepository.findOne({
      where: { projectId: id },
    });

    if (!statistics) {
      // Créer des statistiques vides si elles n'existent pas
      statistics = this.issueStatisticsRepository.create({
        projectId: id,
        totalIssues: 0,
        openIssues: 0,
        inProgressIssues: 0,
        resolvedIssues: 0,
        closedIssues: 0,
        averageResolutionTimeHours: 0,
        activeUsers: 0,
        lastActivity: null,
      });
      await this.issueStatisticsRepository.save(statistics);
    }

    return {
      projectId: id,
      projectKey: project.projectKey,
      insights: {
        totalIssues: statistics.totalIssues,
        openIssues: statistics.openIssues,
        inProgressIssues: statistics.inProgressIssues,
        resolvedIssues: statistics.resolvedIssues,
        closedIssues: statistics.closedIssues,
        averageResolutionTime: statistics.averageResolutionTimeHours,
        activeUsers: statistics.activeUsers,
        lastActivity: statistics.lastActivity,
      },
      calculatedAt: statistics.calculatedAt,
    };
  }

  /**
   * Valide la configuration du projet
   */
  async validateProject(id: string): Promise<any> {
    const project = await this.findOne(id);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validations
    if (!project.projectName || project.projectName.trim().length === 0) {
      errors.push('Project name is required');
    }

    if (!project.projectKey || project.projectKey.trim().length === 0) {
      errors.push('Project key is required');
    }

    if (project.projectKey && !/^[A-Z][A-Z0-9]*$/.test(project.projectKey)) {
      errors.push('Project key must start with a letter and contain only uppercase letters and numbers');
    }

    if (!project.leadUserId) {
      warnings.push('Project has no lead assigned');
    }

    if (project.isArchived) {
      warnings.push('Project is archived');
    }

    return {
      projectId: id,
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date(),
    };
  }
}
