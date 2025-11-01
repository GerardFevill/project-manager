import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Version } from './entities/version.entity';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';

@Injectable()
export class VersionsService {
  constructor(
    @InjectRepository(Version)
    private readonly versionRepository: Repository<Version>,
  ) {}

  async findAll(projectId?: string, includeArchived: boolean = false): Promise<Version[]> {
    const query = this.versionRepository
      .createQueryBuilder('version')
      .leftJoinAndSelect('version.project', 'project')
      .orderBy('version.sequence', 'ASC')
      .addOrderBy('version.releaseDate', 'DESC');

    if (!includeArchived) {
      query.where('version.isArchived = :isArchived', { isArchived: false });
    }

    if (projectId) {
      query.andWhere('version.projectId = :projectId', { projectId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Version> {
    const version = await this.versionRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!version) {
      throw new NotFoundException(`Version with ID ${id} not found`);
    }

    return version;
  }

  async create(createVersionDto: CreateVersionDto): Promise<Version> {
    // Check if version with same name exists in project
    const existing = await this.versionRepository.findOne({
      where: {
        projectId: createVersionDto.projectId,
        name: createVersionDto.name,
      },
    });

    if (existing) {
      throw new ConflictException(`Version ${createVersionDto.name} already exists in this project`);
    }

    const version = this.versionRepository.create({
      ...createVersionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.versionRepository.save(version);
  }

  async update(id: string, updateVersionDto: UpdateVersionDto): Promise<Version> {
    const version = await this.findOne(id);

    // Check name uniqueness if being updated
    if (updateVersionDto.name && updateVersionDto.name !== version.name) {
      const existing = await this.versionRepository.findOne({
        where: {
          projectId: version.projectId,
          name: updateVersionDto.name,
        },
      });

      if (existing) {
        throw new ConflictException(`Version ${updateVersionDto.name} already exists in this project`);
      }
    }

    Object.assign(version, updateVersionDto);
    version.updatedAt = new Date();

    return this.versionRepository.save(version);
  }

  async remove(id: string): Promise<void> {
    const version = await this.findOne(id);
    await this.versionRepository.remove(version);
  }

  async findByProject(projectId: string, includeArchived: boolean = false): Promise<Version[]> {
    const query = this.versionRepository
      .createQueryBuilder('version')
      .where('version.projectId = :projectId', { projectId })
      .orderBy('version.sequence', 'ASC')
      .addOrderBy('version.releaseDate', 'DESC');

    if (!includeArchived) {
      query.andWhere('version.isArchived = :isArchived', { isArchived: false });
    }

    return query.getMany();
  }

  async release(id: string): Promise<Version> {
    const version = await this.findOne(id);
    version.isReleased = true;
    version.releasedAt = new Date();
    version.updatedAt = new Date();
    return this.versionRepository.save(version);
  }

  async unrelease(id: string): Promise<Version> {
    const version = await this.findOne(id);
    version.isReleased = false;
    version.releasedAt = null;
    version.updatedAt = new Date();
    return this.versionRepository.save(version);
  }

  async archive(id: string): Promise<Version> {
    const version = await this.findOne(id);
    version.isArchived = true;
    version.updatedAt = new Date();
    return this.versionRepository.save(version);
  }

  async unarchive(id: string): Promise<Version> {
    const version = await this.findOne(id);
    version.isArchived = false;
    version.updatedAt = new Date();
    return this.versionRepository.save(version);
  }

  async getUnreleased(projectId: string): Promise<Version[]> {
    return this.versionRepository.find({
      where: { projectId, isReleased: false, isArchived: false },
      order: { sequence: 'ASC', releaseDate: 'ASC' },
    });
  }

  async getReleased(projectId: string): Promise<Version[]> {
    return this.versionRepository.find({
      where: { projectId, isReleased: true },
      order: { releasedAt: 'DESC' },
    });
  }
}
