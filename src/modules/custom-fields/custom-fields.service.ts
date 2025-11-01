import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomField } from './entities/custom-field.entity';
import { CustomFieldValue } from './entities/custom-field-value.entity';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { SetFieldValueDto } from './dto/set-field-value.dto';

@Injectable()
export class CustomFieldsService {
  constructor(
    @InjectRepository(CustomField)
    private readonly customFieldRepository: Repository<CustomField>,
    @InjectRepository(CustomFieldValue)
    private readonly customFieldValueRepository: Repository<CustomFieldValue>,
  ) {}

  // Custom Field Definition Management
  async findAllFields(): Promise<CustomField[]> {
    return this.customFieldRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findField(id: string): Promise<CustomField> {
    const field = await this.customFieldRepository.findOne({ where: { id } });

    if (!field) {
      throw new NotFoundException(`Custom field with ID ${id} not found`);
    }

    return field;
  }

  async createField(createCustomFieldDto: CreateCustomFieldDto): Promise<CustomField> {
    // Check if field key already exists
    const existing = await this.customFieldRepository.findOne({
      where: { fieldKey: createCustomFieldDto.fieldKey },
    });

    if (existing) {
      throw new ConflictException(`Custom field with key ${createCustomFieldDto.fieldKey} already exists`);
    }

    const field = this.customFieldRepository.create({
      ...createCustomFieldDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.customFieldRepository.save(field);
  }

  async updateField(id: string, updateCustomFieldDto: UpdateCustomFieldDto): Promise<CustomField> {
    const field = await this.findField(id);

    Object.assign(field, updateCustomFieldDto);
    field.updatedAt = new Date();

    return this.customFieldRepository.save(field);
  }

  async removeField(id: string): Promise<void> {
    const field = await this.findField(id);
    // TODO: Also remove all values for this field
    await this.customFieldRepository.remove(field);
  }

  async findFieldsByProject(projectId: string): Promise<CustomField[]> {
    const allFields = await this.customFieldRepository.find();

    return allFields.filter(field =>
      !field.contextProjects ||
      field.contextProjects.length === 0 ||
      field.contextProjects.includes(projectId)
    );
  }

  async findFieldsByIssueType(issueType: string): Promise<CustomField[]> {
    const allFields = await this.customFieldRepository.find();

    return allFields.filter(field =>
      !field.contextIssueTypes ||
      field.contextIssueTypes.length === 0 ||
      field.contextIssueTypes.includes(issueType)
    );
  }

  // Custom Field Values Management
  async setFieldValue(setFieldValueDto: SetFieldValueDto): Promise<CustomFieldValue> {
    const { issueId, customFieldId, value } = setFieldValueDto;

    // Check if value already exists
    let fieldValue = await this.customFieldValueRepository.findOne({
      where: { issueId, customFieldId },
    });

    if (fieldValue) {
      // Update existing value
      fieldValue.value = value;
      fieldValue.updatedAt = new Date();
    } else {
      // Create new value
      fieldValue = this.customFieldValueRepository.create({
        issueId,
        customFieldId,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return this.customFieldValueRepository.save(fieldValue);
  }

  async getFieldValue(issueId: string, customFieldId: string): Promise<CustomFieldValue | null> {
    return this.customFieldValueRepository.findOne({
      where: { issueId, customFieldId },
      relations: ['customField'],
    });
  }

  async getIssueFieldValues(issueId: string): Promise<CustomFieldValue[]> {
    return this.customFieldValueRepository.find({
      where: { issueId },
      relations: ['customField'],
    });
  }

  async removeFieldValue(issueId: string, customFieldId: string): Promise<void> {
    const fieldValue = await this.customFieldValueRepository.findOne({
      where: { issueId, customFieldId },
    });

    if (!fieldValue) {
      throw new NotFoundException('Field value not found');
    }

    await this.customFieldValueRepository.remove(fieldValue);
  }
}
