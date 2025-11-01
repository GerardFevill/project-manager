import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Issue } from '../issues/entities/issue.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/user.entity';
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

  async search(searchQuery: SearchQuery): Promise<{ results: SearchResult[]; total: number }> {
    const { query, types = ['issue', 'project', 'user'], limit = 50, offset = 0, projectId } = searchQuery;
    const results: SearchResult[] = [];

    if (types.includes('issue')) {
      const issues = await this.searchIssues(query, projectId, limit);
      results.push(...issues);
    }

    if (types.includes('project')) {
      const projects = await this.searchProjects(query, limit);
      results.push(...projects);
    }

    if (types.includes('user')) {
      const users = await this.searchUsers(query, limit);
      results.push(...users);
    }

    if (types.includes('comment')) {
      const comments = await this.searchComments(query, projectId, limit);
      results.push(...comments);
    }

    // Sort by score and apply pagination
    const sorted = results.sort((a, b) => b.score - a.score);
    const paginated = sorted.slice(offset, offset + limit);

    return {
      results: paginated,
      total: sorted.length,
    };
  }

  async quickSearch(query: string, limit: number = 10): Promise<SearchResult[]> {
    const result = await this.search({ query, limit });
    return result.results;
  }

  private async searchIssues(query: string, projectId?: string, limit: number = 50): Promise<SearchResult[]> {
    const qb = this.issueRepository
      .createQueryBuilder('issue')
      .where('issue.summary ILIKE :query', { query: `%${query}%` })
      .orWhere('issue.description ILIKE :query', { query: `%${query}%` })
      .orWhere('issue.key ILIKE :query', { query: `%${query}%` });

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
      },
      score: this.calculateScore(query, issue.summary + ' ' + issue.description),
    }));
  }

  private async searchProjects(query: string, limit: number = 50): Promise<SearchResult[]> {
    const projects = await this.projectRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { key: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      take: limit,
    });

    return projects.map(project => ({
      type: 'project',
      id: project.id,
      title: `${project.key}: ${project.name}`,
      description: project.description,
      metadata: {
        key: project.key,
        leadId: project.leadId,
      },
      score: this.calculateScore(query, project.name + ' ' + project.description),
    }));
  }

  private async searchUsers(query: string, limit: number = 50): Promise<SearchResult[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('user.displayName ILIKE :query', { query: `%${query}%` })
      .take(limit)
      .getMany();

    return users.map(user => ({
      type: 'user',
      id: user.id,
      title: user.displayName || user.username,
      description: user.email,
      metadata: {
        username: user.username,
        email: user.email,
      },
      score: this.calculateScore(query, user.username + ' ' + user.email + ' ' + (user.displayName || '')),
    }));
  }

  private async searchComments(query: string, projectId?: string, limit: number = 50): Promise<SearchResult[]> {
    const qb = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.issue', 'issue')
      .where('comment.body ILIKE :query', { query: `%${query}%` });

    if (projectId) {
      qb.andWhere('issue.projectId = :projectId', { projectId });
    }

    const comments = await qb.take(limit).getMany();

    return comments.map(comment => ({
      type: 'comment',
      id: comment.id,
      title: `Comment on ${comment.issue?.key || 'issue'}`,
      description: comment.body.substring(0, 200),
      metadata: {
        issueId: comment.issueId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
      },
      score: this.calculateScore(query, comment.body),
    }));
  }

  private calculateScore(query: string, text: string): number {
    if (!text) return 0;

    const lowerQuery = query.toLowerCase();
    const lowerText = text.toLowerCase();

    // Exact match = highest score
    if (lowerText === lowerQuery) return 100;

    // Starts with query = high score
    if (lowerText.startsWith(lowerQuery)) return 90;

    // Contains query = medium score
    if (lowerText.includes(lowerQuery)) {
      const position = lowerText.indexOf(lowerQuery);
      // Earlier occurrence = higher score
      return Math.max(50, 80 - position / 10);
    }

    // Word match = lower score
    const words = lowerQuery.split(' ');
    const matchedWords = words.filter(word => lowerText.includes(word)).length;
    return (matchedWords / words.length) * 50;
  }
}
