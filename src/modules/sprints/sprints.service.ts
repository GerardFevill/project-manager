import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Board } from '../boards/entities/board.entity';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll(boardId?: string): Promise<Sprint[]> {
    const queryBuilder = this.sprintRepository
      .createQueryBuilder('sprint')
      .leftJoinAndSelect('sprint.board', 'board')
      .orderBy('sprint.sequence', 'ASC');

    if (boardId) {
      queryBuilder.where('sprint.boardId = :boardId', { boardId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({
      where: { id },
      relations: ['board'],
    });

    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }

    return sprint;
  }

  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const { boardId } = createSprintDto;

    // Verify board exists
    const board = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!board) {
      throw new BadRequestException(`Board with ID ${boardId} not found`);
    }

    const sprint = this.sprintRepository.create({
      ...createSprintDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.sprintRepository.save(sprint);
  }

  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id);

    Object.assign(sprint, updateSprintDto);
    sprint.updatedAt = new Date();

    return this.sprintRepository.save(sprint);
  }

  async remove(id: string): Promise<void> {
    const sprint = await this.findOne(id);
    await this.sprintRepository.remove(sprint);
  }

  async start(id: string): Promise<Sprint> {
    const sprint = await this.findOne(id);
    sprint.status = 'Active';
    sprint.startDate = new Date();
    sprint.updatedAt = new Date();
    return this.sprintRepository.save(sprint);
  }

  async complete(id: string): Promise<Sprint> {
    const sprint = await this.findOne(id);
    sprint.status = 'Closed';
    sprint.completedAt = new Date();
    sprint.updatedAt = new Date();
    return this.sprintRepository.save(sprint);
  }

  async findByBoard(boardId: string): Promise<Sprint[]> {
    return this.sprintRepository.find({
      where: { boardId },
      relations: ['board'],
      order: { sequence: 'ASC' },
    });
  }
}
