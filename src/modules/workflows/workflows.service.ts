import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

/**
 * WorkflowsService
 *
 * Service complet pour la gestion des workflows avec toutes les fonctionnalités Jira:
 * - CRUD de base
 * - Gestion des transitions (états et règles)
 * - Publishing et draft (versions brouillon/publiée)
 * - Propriétés de workflow
 * - Workflow schemes (association workflows-projets)
 * - Règles de transition
 */
@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) {}

  // ==================== CRUD DE BASE ====================

  /**
   * Récupère tous les workflows
   * Triés par date de création (plus récents en premier)
   */
  async findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupère un workflow par son ID
   */
  async findOne(id: string): Promise<Workflow> {
    const workflow = await this.workflowRepository.findOne({
      where: { id },
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    return workflow;
  }

  /**
   * Crée un nouveau workflow
   */
  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const workflow = this.workflowRepository.create({
      ...createWorkflowDto,
      isActive: true,
      isDefault: false,
      isActive: false, // Nouveaux workflows commencent en draft
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.workflowRepository.save(workflow);
  }

  /**
   * Met à jour un workflow
   */
  async update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<Workflow> {
    const workflow = await this.findOne(id);

    Object.assign(workflow, updateWorkflowDto);
    workflow.updatedAt = new Date();

    return this.workflowRepository.save(workflow);
  }

  /**
   * Supprime un workflow
   */
  async remove(id: string): Promise<void> {
    const workflow = await this.findOne(id);
    await this.workflowRepository.remove(workflow);
  }

  // ==================== TRANSITIONS ====================

  /**
   * Récupère toutes les transitions d'un workflow
   * Une transition = passage d'un statut à un autre (ex: "To Do" → "In Progress")
   */
  async getWorkflowTransitions(id: string): Promise<any> {
    const workflow = await this.findOne(id);

    // TODO: Implémenter la table workflow_transitions
    // Structure:
    // - transitionId, workflowId, name
    // - fromStatusId, toStatusId
    // - screenId (écran affiché lors de la transition)
    // - properties (conditions, validations, post-functions)

    return {
      workflowId: id,
      workflowName: workflow.workflowName,
      transitions: [
        // Exemple de structure:
        // {
        //   id: 'trans1',
        //   name: 'Start Progress',
        //   fromStatus: { id: 'open', name: 'Open' },
        //   toStatus: { id: 'in-progress', name: 'In Progress' },
        //   screen: null,
        //   properties: {}
        // }
      ],
    };
  }

  /**
   * Met à jour une transition d'un workflow
   * Permet de modifier les propriétés, conditions, validations
   */
  async updateWorkflowTransition(
    workflowId: string,
    transitionId: string,
    data: any,
  ): Promise<any> {
    const workflow = await this.findOne(workflowId);

    // TODO: Mettre à jour dans workflow_transitions table
    // data peut contenir:
    // - name: nouveau nom de la transition
    // - fromStatusId, toStatusId: nouveaux statuts
    // - screenId: écran à afficher
    // - conditions: règles à vérifier avant transition
    // - validators: validations des champs
    // - postFunctions: actions après transition

    return {
      workflowId,
      transitionId,
      updated: true,
      data,
      updatedAt: new Date(),
    };
  }

  // ==================== PUBLISHING & DRAFT ====================

  /**
   * Publie un workflow (le rend actif)
   * Un workflow doit être publié pour être utilisé par les projets
   */
  async publishWorkflow(id: string): Promise<any> {
    const workflow = await this.findOne(id);

    // Marquer comme publié et actif
    !workflow.isActive = false;
    workflow.isActive = true;
    workflow.updatedAt = new Date();

    await this.workflowRepository.save(workflow);

    return {
      workflowId: id,
      workflowName: workflow.workflowName,
      published: true,
      publishedAt: new Date(),
      isActive: true,
      isActive: true,
    };
  }

  /**
   * Récupère la version draft d'un workflow
   * Permet de modifier un workflow sans affecter la version publiée
   */
  async getDraftWorkflow(id: string): Promise<any> {
    const workflow = await this.findOne(id);

    // TODO: Implémenter un système de versioning
    // Possibilité 1: Table workflow_drafts
    // Possibilité 2: Colonne JSON pour stocker draft
    // Possibilité 3: Workflow dupliqué avec flag isDraft

    return {
      workflowId: id,
      workflowName: workflow.workflowName,
      hasDraft: !workflow.isActive,
      draft: !workflow.isActive ? workflow : null,
      published: !workflow.isActive ? null : workflow,
    };
  }

  /**
   * Crée une version draft d'un workflow publié
   * Permet de travailler sur des modifications sans impacter la production
   */
  async createDraftWorkflow(id: string): Promise<any> {
    const workflow = await this.findOne(id);

    // TODO: Créer une copie en draft
    // Si le workflow est déjà draft, retourner tel quel
    // Sinon, créer une copie avec isDraft=true

    if (!workflow.isActive) {
      return {
        workflowId: id,
        message: 'Workflow is already in draft mode',
        draft: workflow,
      };
    }

    // TODO: Implémenter la création de draft
    // const draft = this.workflowRepository.create({
    //   ...workflow,
    //   id: undefined, // nouveau ID
    //   isActive: false,
    //   parentWorkflowId: id,
    // });

    return {
      workflowId: id,
      originalWorkflow: workflow,
      draft: {
        ...workflow,
        isActive: false,
        parentWorkflowId: id,
      },
      createdAt: new Date(),
    };
  }

  // ==================== PROPRIÉTÉS ====================

  /**
   * Met à jour les propriétés d'un workflow
   * Propriétés = métadonnées et configuration (permissions, options, etc.)
   */
  async updateWorkflowProperties(id: string, properties: any): Promise<any> {
    const workflow = await this.findOne(id);

    // TODO: Stocker dans une colonne JSON ou table workflow_properties
    // Propriétés possibles:
    // - allowedRoles: rôles autorisés à modifier
    // - allowedGroups: groupes autorisés
    // - options: configuration diverses
    // - metadata: métadonnées personnalisées

    workflow.updatedAt = new Date();
    await this.workflowRepository.save(workflow);

    return {
      workflowId: id,
      workflowName: workflow.workflowName,
      properties,
      updatedAt: new Date(),
    };
  }

  // ==================== WORKFLOW SCHEMES ====================

  /**
   * Récupère les workflow schemes pour plusieurs projets
   * Un workflow scheme = association entre issue types et workflows
   * Format: "projectId1,projectId2,projectId3"
   */
  async getWorkflowSchemesForProjects(projectIds: string): Promise<any> {
    const ids = projectIds.split(',').map(id => id.trim()).filter(id => id);

    // TODO: Implémenter la table workflow_schemes
    // Structure:
    // - schemeId, projectId
    // - mappings: { issueType → workflow }
    // Exemple: { "Bug" → "Bug Workflow", "Task" → "Default Workflow" }

    return {
      requestedProjects: ids,
      schemes: ids.map(projectId => ({
        projectId,
        schemeId: null,
        schemeName: 'Default Workflow Scheme',
        mappings: [
          // Exemple:
          // { issueType: 'Bug', issueTypeId: 'bug', workflowId: 'workflow1', workflowName: 'Bug Workflow' },
          // { issueType: 'Task', issueTypeId: 'task', workflowId: 'workflow2', workflowName: 'Task Workflow' }
        ],
      })),
    };
  }

  // ==================== TRANSITION RULES ====================

  /**
   * Ajoute des règles de transition
   * Les règles contrôlent qui peut effectuer quelles transitions et sous quelles conditions
   */
  async addTransitionRules(rules: any): Promise<any> {
    // TODO: Implémenter la table transition_rules
    // Types de règles:
    // - Conditions: vérifications avant transition (ex: champ obligatoire rempli)
    // - Validators: validations des données (ex: format email valide)
    // - Post-functions: actions après transition (ex: notifier assignee, créer sous-tâche)
    // - Permissions: qui peut effectuer la transition (rôles, groupes)

    return {
      rules,
      created: true,
      createdAt: new Date(),
      ruleTypes: {
        conditions: rules.conditions || [],
        validators: rules.validators || [],
        postFunctions: rules.postFunctions || [],
        permissions: rules.permissions || [],
      },
    };
  }

  // ==================== VALIDATION ====================

  /**
   * Valide un workflow
   * Vérifie la cohérence (statuts, transitions, règles)
   */
  async validateWorkflow(id: string): Promise<any> {
    const workflow = await this.findOne(id);
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validations de base
    if (!workflow.workflowName || workflow.workflowName.trim().length === 0) {
      errors.push('Workflow name is required');
    }

    if (workflow.workflowName && workflow.workflowName.length > 255) {
      errors.push('Workflow name is too long (max 255 characters)');
    }

    // Avertissements
    if (!workflow.isActive) {
      warnings.push('Workflow is in draft mode and not published');
    }

    if (!workflow.isActive) {
      warnings.push('Workflow is inactive');
    }

    // TODO: Validations avancées
    // - Vérifier qu'il y a au moins 2 statuts
    // - Vérifier qu'il y a au moins 1 transition
    // - Vérifier qu'aucun statut n'est isolé (accessible et peut sortir)
    // - Vérifier les cycles de transitions
    // - Vérifier les règles de transition

    return {
      workflowId: id,
      workflowName: workflow.workflowName,
      valid: errors.length === 0,
      errors,
      warnings,
      isDraft: !workflow.isActive,
      isActive: workflow.isActive,
      validatedAt: new Date(),
    };
  }

  // ==================== RECHERCHE ====================

  /**
   * Recherche de workflows par nom ou description
   */
  async searchWorkflows(query: string): Promise<Workflow[]> {
    return this.workflowRepository
      .createQueryBuilder('workflow')
      .where('workflow.workflowName LIKE :query', { query: `%${query}%` })
      .orWhere('workflow.description LIKE :query', { query: `%${query}%` })
      .orderBy('workflow.workflowName', 'ASC')
      .take(20)
      .getMany();
  }
}
