import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
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

    // TODO: Implémenter la table project_users pour stocker les membres
    // Pour l'instant, retourner un objet avec structure attendue
    return {
      projectId: id,
      projectKey: project.projectKey,
      users: [],
      // Structure attendue:
      // users: [
      //   { userId: '1', role: 'Developer', addedAt: Date }
      // ]
    };
  }

  /**
   * Récupère les acteurs d'un rôle de projet
   */
  async getRoleActors(projectId: string, roleId: string): Promise<any> {
    const project = await this.findOne(projectId);

    // TODO: Implémenter la table project_role_actors
    return {
      projectId,
      roleId,
      actors: [],
      // Structure attendue:
      // actors: [
      //   { actorId: '1', actorType: 'user', name: 'John Doe' }
      // ]
    };
  }

  /**
   * Ajoute un acteur à un rôle de projet
   */
  async addRoleActor(
    projectId: string,
    roleId: string,
    actorData: { actorId: string; actorType: 'user' | 'group' },
  ): Promise<any> {
    const project = await this.findOne(projectId);

    // TODO: Implémenter l'ajout dans project_role_actors
    return {
      projectId,
      roleId,
      actor: {
        ...actorData,
        addedAt: new Date(),
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

    // TODO: Implémenter la suppression dans project_role_actors
    // Pour l'instant, juste vérifier que le projet existe
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

    // Fonctionnalités Jira standard
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

  /**
   * Met à jour les fonctionnalités du projet
   */
  async updateProjectFeatures(
    id: string,
    features: Record<string, { enabled: boolean }>,
  ): Promise<any> {
    const project = await this.findOne(id);

    // TODO: Stocker les features dans une table project_features
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

    return {
      projectId: id,
      avatarUrl: null, // TODO: Implémenter le stockage d'avatars
      avatarType: 'default',
    };
  }

  /**
   * Upload un avatar pour le projet
   */
  async uploadProjectAvatar(id: string, avatarData: { url: string }): Promise<any> {
    const project = await this.findOne(id);

    // TODO: Stocker l'URL de l'avatar dans la table projects
    // ou dans une table dédiée project_avatars
    return {
      projectId: id,
      avatarUrl: avatarData.url,
      uploadedAt: new Date(),
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

    // TODO: Calculer les vraies statistiques depuis les issues
    return {
      projectId: id,
      projectKey: project.projectKey,
      insights: {
        totalIssues: 0,
        openIssues: 0,
        inProgressIssues: 0,
        resolvedIssues: 0,
        closedIssues: 0,
        averageResolutionTime: 0, // en heures
        activeUsers: 0,
        lastActivity: null,
      },
      calculatedAt: new Date(),
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
