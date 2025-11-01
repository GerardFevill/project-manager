import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Issue } from '../issues/entities/issue.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/comment.entity';

export interface SearchQuery {
  query: string;
  types?: string[]; // ['issue', 'project', 'user', 'comment']
  projectId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  score: number;
}

/**
 * SearchService
 *
 * Service complet de recherche multi-entités avec:
 * - Recherche globale (issues, projects, users, comments)
 * - Quick search pour suggestions rapides
 * - Recherche JQL (Jira Query Language)
 * - Scoring intelligent (exact match, starts with, contains, word match)
 * - Pagination et tri par score
 */
@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  // ==================== RECHERCHE GLOBALE ====================

  /**
   * Recherche globale multi-entités
   * Recherche dans issues, projects, users, comments selon les types spécifiés
   * Tri par score de pertinence
   */
  async search(searchQuery: SearchQuery): Promise<{ results: SearchResult[]; total: number }> {
    const { query, types = ['issue', 'project', 'user'], limit = 50, offset = 0, projectId } = searchQuery;
    const results: SearchResult[] = [];

    // Recherche dans chaque type demandé
    if (types.includes('issue')) {
      const issues = await this.searchIssues(query, projectId, limit);
      results.push(...issues);
    }

    if (types.includes('project')) {
      const projects = await this.searchProjectsInternal(query, limit);
      results.push(...projects);
    }

    if (types.includes('user')) {
      const users = await this.searchUsersInternal(query, limit);
      results.push(...users);
    }

    if (types.includes('comment')) {
      const comments = await this.searchComments(query, projectId, limit);
      results.push(...comments);
    }

    // Tri par score décroissant
    const sorted = results.sort((a, b) => b.score - a.score);

    // Pagination
    const paginated = sorted.slice(offset, offset + limit);

    return {
      results: paginated,
      total: sorted.length,
    };
  }

  /**
   * Quick search pour suggestions rapides
   * Recherche dans tous les types avec limite basse (10 par défaut)
   */
  async quickSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
    const result = await this.search({ query, limit });
    return result.results;
  }

  // ==================== RECHERCHES PRIVÉES ====================

  /**
   * Recherche d'issues par summary, description ou key
   * Support filtrage par projectId
   */
  private async searchIssues(
    query: string,
    projectId?: string,
    limit: number = 50
  ): Promise<SearchResult[]> {
    const qb = this.issueRepository
      .createQueryBuilder('issue')
      .where('issue.summary ILIKE :query', { query: `%${query}%` })
      .orWhere('issue.description ILIKE :query', { query: `%${query}%` })
      .orWhere('issue.key ILIKE :query', { query: `%${query}%` });

    // Filtrage par projet si spécifié
    if (projectId) {
      qb.andWhere('issue.projectId = :projectId', { projectId });
    }

    const issues = await qb.take(limit).getMany();

    return issues.map(issue => ({
      type: 'issue',
      id: issue.id,
      title: `${issue.key}: ${issue.summary}`,
      description: issue.description,
      metadata: {
        key: issue.key,
        status: issue.status,
        priority: issue.priority,
        projectId: issue.projectId,
        assigneeId: issue.assigneeId,
        reporterId: issue.reporterId,
      },
      score: this.calculateScore(query, issue.summary + ' ' + (issue.description || '')),
    }));
  }

  /**
   * Recherche de projets par name, key ou description
   */
  private async searchProjectsInternal(query: string, limit: number = 50): Promise<SearchResult[]> {
    const projects = await this.projectRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { projectKey: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      take: limit,
    });

    return projects.map(project => ({
      type: 'project',
      id: project.id,
      title: `${project.projectKey}: ${project.name}`,
      description: project.description,
      metadata: {
        key: project.projectKey,
        leadId: project.leadId,
        isArchived: project.isArchived,
      },
      score: this.calculateScore(query, project.name + ' ' + (project.description || '')),
    }));
  }

  /**
   * Recherche d'utilisateurs par username, email ou displayName
   */
  private async searchUsersInternal(query: string, limit: number = 50): Promise<SearchResult[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('CONCAT(user.firstName, \' \', user.lastName) ILIKE :query', { query: `%${query}%` })
      .take(limit)
      .getMany();

    return users.map(user => ({
      type: 'user',
      id: user.id,
      title: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
      description: user.email,
      metadata: {
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
      score: this.calculateScore(
        query,
        user.username + ' ' + user.email + ' ' + `${user.firstName || ''} ${user.lastName || ''}`
      ),
    }));
  }

  /**
   * Recherche de commentaires par body
   * Support filtrage par projectId (via issue.projectId)
   */
  private async searchComments(
    query: string,
    projectId?: string,
    limit: number = 50
  ): Promise<SearchResult[]> {
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.issue', 'issue')
      .where('comment.body ILIKE :query', { query: `%${query}%` });

    // Filtrage par projet si spécifié
    if (projectId) {
      qb.andWhere('issue.projectId = :projectId', { projectId });
    }

    const comments = await qb.take(limit).getMany();

    return comments.map(comment => ({
      type: 'comment',
      id: comment.id,
      title: `Comment on ${comment.issue?.key || 'issue'}`,
      description: comment.body ? comment.body.substring(0, 200) : '',
      metadata: {
        issueId: comment.issueId,
        issueKey: comment.issue?.key,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
      },
      score: this.calculateScore(query, comment.body || ''),
    }));
  }

  // ==================== SCORING ====================

  /**
   * Calcule un score de pertinence (0-100)
   * - 100: Exact match
   * - 90: Starts with query
   * - 50-80: Contains query (position-based)
   * - 0-50: Word match (partial)
   */
  private calculateScore(query: string, text: string): number {
    if (!text) return 0;

    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // Exact match = score maximum
    if (lowerText === lowerQuery) return 100;

    // Commence par query = score élevé
    if (lowerText.startsWith(lowerQuery)) return 90;

    // Contient query = score moyen (dépend de la position)
    if (lowerText.includes(lowerQuery)) {
      const position = lowerText.indexOf(lowerQuery);
      // Plus tôt dans le texte = score plus élevé
      return Math.max(50, 80 - position / 10);
    }

    // Word match = score faible
    const words = lowerQuery.split(' ');
    const matchedWords = words.filter(word => lowerText.includes(word)).length;
    return (matchedWords / words.length) * 50;
  }

  // ==================== RECHERCHE JQL ====================

  /**
   * Recherche avec JQL (Jira Query Language)
   * Exemple: "project = PROJ AND status = Open AND assignee = currentUser()"
   */
  async searchWithJQL(jql: string): Promise<any> {
    // TODO: Implémenter un parser JQL complet
    // Le JQL supporte:
    // - Champs: project, status, assignee, reporter, priority, type, etc.
    // - Opérateurs: =, !=, >, <, >=, <=, IN, NOT IN, LIKE
    // - Combinateurs: AND, OR, NOT
    // - Fonctions: currentUser(), now(), startOfDay(), etc.
    // - Ordre: ORDER BY field ASC/DESC

    // Pour l'instant, retourner une structure de base
    return {
      jql,
      parsed: this.parseJQLSimple(jql),
      results: [],
      total: 0,
      message: 'JQL parser not yet implemented - use search() for basic queries',
    };
  }

  /**
   * Parser JQL simple (basique)
   * Parse les opérations simples: "field = value"
   */
  private parseJQLSimple(jql: string): any {
    // Parser très basique pour démonstration
    const parts = jql.split(/\s+AND\s+/i);

    const clauses = parts.map(part => {
      const match = part.match(/(\w+)\s*([=!<>]+)\s*(.+)/);
      if (match) {
        return {
          field: match[1],
          operator: match[2],
          value: match[3].trim(),
        };
      }
      return null;
    }).filter(Boolean);

    return {
      clauses,
      orderBy: null, // TODO: Parse ORDER BY
      limit: null, // TODO: Parse LIMIT
    };
  }

  // ==================== RECHERCHES PUBLIQUES ====================

  /**
   * Recherche d'utilisateurs (endpoint public)
   * Recherche par username, email, firstName, lastName
   */
  async searchUsers(query: string): Promise<any> {
    const results = await this.searchUsersInternal(query, 20);

    return {
      query,
      total: results.length,
      users: results.map(r => ({
        id: r.id,
        username: r.metadata.username,
        email: r.metadata.email,
        displayName: r.title,
        isActive: r.metadata.isActive,
        score: r.score,
      })),
    };
  }

  /**
   * Recherche de projets (endpoint public)
   * Recherche par name, key, description
   */
  async searchProjects(query: string): Promise<any> {
    const results = await this.searchProjectsInternal(query, 20);

    return {
      query,
      total: results.length,
      projects: results.map(r => ({
        id: r.id,
        key: r.metadata.key,
        name: r.title.split(': ')[1] || r.title,
        description: r.description,
        leadId: r.metadata.leadId,
        isArchived: r.metadata.isArchived,
        score: r.score,
      })),
    };
  }
}
