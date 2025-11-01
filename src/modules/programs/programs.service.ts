import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto): Promise<Program> {
    const program = this.programRepository.create({
      ...createProgramDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.programRepository.save(program);
  }

  async findAll(portfolioId?: string): Promise<Program[]> {
    const query: any = {};
    if (portfolioId) query.portfolioId = portfolioId;
    return this.programRepository.find({ where: query, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Program> {
    const program = await this.programRepository.findOne({ where: { id } });
    if (!program) throw new NotFoundException(`Program ${id} not found`);
    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto): Promise<Program> {
    const program = await this.findOne(id);
    Object.assign(program, updateProgramDto);
    program.updatedAt = new Date();
    return this.programRepository.save(program);
  }

  async remove(id: string): Promise<void> {
    const program = await this.findOne(id);
    await this.programRepository.remove(program);
  }

  async addProject(programId: string, projectId: string): Promise<Program> {
    const program = await this.findOne(programId);
    if (!program.projectIds) program.projectIds = [];
    if (!program.projectIds.includes(projectId)) {
      program.projectIds.push(projectId);
    }
    return this.programRepository.save(program);
  }

  async removeProject(programId: string, projectId: string): Promise<Program> {
    const program = await this.findOne(programId);
    if (program.projectIds) {
      program.projectIds = program.projectIds.filter(id => id !== projectId);
    }
    return this.programRepository.save(program);
  }
}
