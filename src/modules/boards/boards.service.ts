import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(projectId?: string): Promise<Board[]> {
    const queryBuilder = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.project', 'project')
      .orderBy('board.createdAt', 'DESC');

    if (projectId) {
      queryBuilder.where('board.projectId = :projectId', { projectId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const { projectId } = createBoardDto;

    // Verify project exists
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new BadRequestException(`Project with ID ${projectId} not found`);
    }

    const board = this.boardRepository.create({
      ...createBoardDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.boardRepository.save(board);
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.findOne(id);

    Object.assign(board, updateBoardDto);
    board.updatedAt = new Date();

    return this.boardRepository.save(board);
  }

  async remove(id: string): Promise<void> {
    const board = await this.findOne(id);
    await this.boardRepository.remove(board);
  }

  async findByProject(projectId: string): Promise<Board[]> {
    return this.boardRepository.find({
      where: { projectId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }
}
