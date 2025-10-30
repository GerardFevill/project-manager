import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from './entities/sprint.entity';
import { Task } from '../tasks/task.entity';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintStatus } from './enums/sprint-status.enum';

@Injectable()
export class SprintsService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const sprint = this.sprintRepository.create(createSprintDto);
    return await this.sprintRepository.save(sprint);
  }

  async findAll(params?: {
    status?: SprintStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: Sprint[]; meta: any }> {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.sprintRepository
      .createQueryBuilder('sprint')
      .orderBy('sprint.createdAt', 'DESC');

    if (params?.status) {
      queryBuilder.andWhere('sprint.status = :status', {
        status: params.status,
      });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({ where: { id } });
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  async findActiveSprint(): Promise<Sprint | null> {
    return await this.sprintRepository.findOne({
      where: { status: SprintStatus.ACTIVE },
    });
  }

  async update(id: number, updateSprintDto: UpdateSprintDto): Promise<Sprint> {
    const sprint = await this.findOne(id);

    // If trying to set status to ACTIVE, check no other sprint is active
    if (
      updateSprintDto.status === SprintStatus.ACTIVE &&
      sprint.status !== SprintStatus.ACTIVE
    ) {
      const activeSprint = await this.findActiveSprint();
      if (activeSprint && activeSprint.id !== id) {
        throw new ConflictException(
          `Cannot activate sprint. Sprint "${activeSprint.name}" is already active.`,
        );
      }
    }

    Object.assign(sprint, updateSprintDto);
    return await this.sprintRepository.save(sprint);
  }

  async remove(id: number): Promise<void> {
    const sprint = await this.findOne(id);
    await this.sprintRepository.remove(sprint);
  }

  async startSprint(id: number): Promise<Sprint> {
    return await this.update(id, { status: SprintStatus.ACTIVE });
  }

  async completeSprint(id: number): Promise<Sprint> {
    return await this.update(id, { status: SprintStatus.COMPLETED });
  }

  async getSprintTasks(id: number): Promise<Task[]> {
    // Verify sprint exists
    await this.findOne(id);

    return await this.taskRepository.find({
      where: { sprintId: id },
      order: { createdAt: 'ASC' },
    });
  }

  async getSprintDetails(id: number): Promise<Sprint & { tasks: Task[] }> {
    const sprint = await this.findOne(id);
    const tasks = await this.getSprintTasks(id);

    return {
      ...sprint,
      tasks,
    };
  }

  async assignTaskToSprint(
    sprintId: number,
    taskId: string,
  ): Promise<{ message: string; task: Task }> {
    // Verify sprint exists
    await this.findOne(sprintId);

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    task.sprintId = sprintId;
    const updatedTask = await this.taskRepository.save(task);

    return {
      message: 'Task assigned to sprint successfully',
      task: updatedTask,
    };
  }

  async removeTaskFromSprint(
    sprintId: number,
    taskId: string,
  ): Promise<{ message: string; task: Task }> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    if (task.sprintId !== sprintId) {
      throw new ConflictException(
        `Task ${taskId} is not in sprint ${sprintId}`,
      );
    }

    task.sprintId = null;
    const updatedTask = await this.taskRepository.save(task);

    return {
      message: 'Task removed from sprint successfully',
      task: updatedTask,
    };
  }
}
