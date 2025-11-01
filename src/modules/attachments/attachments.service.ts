import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async findAll(issueId?: string): Promise<Attachment[]> {
    const query = this.attachmentRepository
      .createQueryBuilder('attachment')
      .leftJoinAndSelect('attachment.uploader', 'uploader')
      .leftJoinAndSelect('attachment.issue', 'issue')
      .orderBy('attachment.createdAt', 'DESC');

    if (issueId) {
      query.where('attachment.issueId = :issueId', { issueId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations: ['uploader', 'issue'],
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  async create(createAttachmentDto: CreateAttachmentDto, uploaderId: string): Promise<Attachment> {
    const attachment = this.attachmentRepository.create({
      ...createAttachmentDto,
      uploaderId,
      createdAt: new Date(),
    });

    return this.attachmentRepository.save(attachment);
  }

  async remove(id: string): Promise<void> {
    const attachment = await this.findOne(id);
    // TODO: Delete physical file from storage
    await this.attachmentRepository.remove(attachment);
  }

  async findByIssue(issueId: string): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { issueId },
      relations: ['uploader'],
      order: { createdAt: 'DESC' },
    });
  }
}
