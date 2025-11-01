import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watcher } from './entities/watcher.entity';
import { CreateWatcherDto } from './dto/create-watcher.dto';

@Injectable()
export class WatchersService {
  constructor(
    @InjectRepository(Watcher)
    private readonly watcherRepository: Repository<Watcher>,
  ) {}

  async findAll(issueId?: string): Promise<Watcher[]> {
    const query = this.watcherRepository
      .createQueryBuilder('watcher')
      .leftJoinAndSelect('watcher.user', 'user')
      .leftJoinAndSelect('watcher.issue', 'issue')
      .orderBy('watcher.watchedAt', 'DESC');

    if (issueId) {
      query.where('watcher.issueId = :issueId', { issueId });
    }

    return query.getMany();
  }

  async findByIssue(issueId: string): Promise<Watcher[]> {
    return this.watcherRepository.find({
      where: { issueId },
      relations: ['user'],
      order: { watchedAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Watcher[]> {
    return this.watcherRepository.find({
      where: { userId },
      relations: ['issue'],
      order: { watchedAt: 'DESC' },
    });
  }

  async watch(createWatcherDto: CreateWatcherDto, userId: string): Promise<Watcher> {
    // Check if already watching
    const existing = await this.watcherRepository.findOne({
      where: {
        issueId: createWatcherDto.issueId,
        userId,
      },
    });

    if (existing) {
      throw new ConflictException('Already watching this issue');
    }

    const watcher = this.watcherRepository.create({
      ...createWatcherDto,
      userId,
      watchedAt: new Date(),
    });

    return this.watcherRepository.save(watcher);
  }

  async unwatch(issueId: string, userId: string): Promise<void> {
    const watcher = await this.watcherRepository.findOne({
      where: { issueId, userId },
    });

    if (!watcher) {
      throw new NotFoundException('Not watching this issue');
    }

    await this.watcherRepository.remove(watcher);
  }

  async isWatching(issueId: string, userId: string): Promise<boolean> {
    const count = await this.watcherRepository.count({
      where: { issueId, userId },
    });

    return count > 0;
  }
}
