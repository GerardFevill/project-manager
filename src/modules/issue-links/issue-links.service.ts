import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueLink } from './entities/issue-link.entity';
import { CreateIssueLinkDto } from './dto/create-issue-link.dto';

@Injectable()
export class IssueLinksService {
  constructor(
    @InjectRepository(IssueLink)
    private readonly issueLinkRepository: Repository<IssueLink>,
  ) {}

  async findAll(issueId?: string): Promise<IssueLink[]> {
    const query = this.issueLinkRepository
      .createQueryBuilder('link')
      .leftJoinAndSelect('link.sourceIssue', 'sourceIssue')
      .leftJoinAndSelect('link.targetIssue', 'targetIssue')
      .leftJoinAndSelect('link.creator', 'creator')
      .orderBy('link.createdAt', 'DESC');

    if (issueId) {
      query.where('link.sourceIssueId = :issueId', { issueId })
        .orWhere('link.targetIssueId = :issueId', { issueId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<IssueLink> {
    const link = await this.issueLinkRepository.findOne({
      where: { id },
      relations: ['sourceIssue', 'targetIssue', 'creator'],
    });

    if (!link) {
      throw new NotFoundException(`Issue link with ID ${id} not found`);
    }

    return link;
  }

  async create(createIssueLinkDto: CreateIssueLinkDto, creatorId: string): Promise<IssueLink> {
    const { sourceIssueId, targetIssueId, linkType } = createIssueLinkDto;

    // Prevent self-linking
    if (sourceIssueId === targetIssueId) {
      throw new BadRequestException('Cannot link an issue to itself');
    }

    // Check if link already exists
    const existing = await this.issueLinkRepository.findOne({
      where: {
        sourceIssueId,
        targetIssueId,
        linkType,
      },
    });

    if (existing) {
      throw new ConflictException('This issue link already exists');
    }

    const link = this.issueLinkRepository.create({
      ...createIssueLinkDto,
      creatorId,
      createdAt: new Date(),
    });

    return this.issueLinkRepository.save(link);
  }

  async remove(id: string): Promise<void> {
    const link = await this.findOne(id);
    await this.issueLinkRepository.remove(link);
  }

  async findByIssue(issueId: string): Promise<{
    outbound: IssueLink[];
    inbound: IssueLink[];
  }> {
    const outbound = await this.issueLinkRepository.find({
      where: { sourceIssueId: issueId },
      relations: ['targetIssue', 'creator'],
      order: { createdAt: 'DESC' },
    });

    const inbound = await this.issueLinkRepository.find({
      where: { targetIssueId: issueId },
      relations: ['sourceIssue', 'creator'],
      order: { createdAt: 'DESC' },
    });

    return { outbound, inbound };
  }

  async findBlockedIssues(issueId: string): Promise<IssueLink[]> {
    return this.issueLinkRepository.find({
      where: { sourceIssueId: issueId, linkType: 'blocks' },
      relations: ['targetIssue'],
    });
  }

  async findBlockingIssues(issueId: string): Promise<IssueLink[]> {
    return this.issueLinkRepository.find({
      where: { targetIssueId: issueId, linkType: 'blocks' },
      relations: ['sourceIssue'],
    });
  }

  async findRelatedIssues(issueId: string): Promise<IssueLink[]> {
    return this.issueLinkRepository.find({
      where: [
        { sourceIssueId: issueId, linkType: 'relates_to' },
        { targetIssueId: issueId, linkType: 'relates_to' },
      ],
      relations: ['sourceIssue', 'targetIssue'],
    });
  }
}
