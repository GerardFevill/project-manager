import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Priority } from './entities/Priority.entity';
import { IssueType } from './entities/IssueType.entity';
import { Resolution } from './entities/Resolution.entity';
import { Status } from './entities/Status.entity';
import { ServerInfo } from './entities/ServerInfo.entity';
import { ApplicationProperty } from './entities/ApplicationProperty.entity';
import { CreatePriorityDto, UpdatePriorityDto } from './dto/priority.dto';
import { CreateIssueTypeDto, UpdateIssueTypeDto } from './dto/issue-type.dto';
import { CreateResolutionDto, UpdateResolutionDto } from './dto/resolution.dto';
import { CreateStatusDto, UpdateStatusDto } from './dto/status.dto';
import { UpdateApplicationPropertyDto } from './dto/application-property.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepository: Repository<Priority>,
    @InjectRepository(IssueType)
    private readonly issueTypeRepository: Repository<IssueType>,
    @InjectRepository(Resolution)
    private readonly resolutionRepository: Repository<Resolution>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(ServerInfo)
    private readonly serverInfoRepository: Repository<ServerInfo>,
    @InjectRepository(ApplicationProperty)
    private readonly applicationPropertyRepository: Repository<ApplicationProperty>,
  ) {}

  // ========== SERVER INFO ==========

  async getServerInfo() {
    const info = await this.serverInfoRepository.findOne({ where: {}, order: { createdAt: 'DESC' } });
    if (!info) {
      // Return default server info
      return {
        version: '9.4.0',
        buildNumber: '940001',
        buildDate: new Date(),
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
        deploymentType: 'production',
        serverTitle: 'Project Manager API',
      };
    }
    return info;
  }

  async getConfiguration() {
    return {
      timeTracking: await this.getTimeTrackingConfiguration(),
      attachments: { enabled: true, maxSize: 10485760 },
      voting: { enabled: true },
      watching: { enabled: true },
      issueLinks: { enabled: true },
    };
  }

  async getTimeTrackingConfiguration() {
    const hoursPerDay = await this.applicationPropertyRepository.findOne({
      where: { key: 'jira.timetracking.hours.per.day' },
    });
    const daysPerWeek = await this.applicationPropertyRepository.findOne({
      where: { key: 'jira.timetracking.days.per.week' },
    });
    const format = await this.applicationPropertyRepository.findOne({
      where: { key: 'jira.timetracking.format' },
    });

    return {
      workingHoursPerDay: parseFloat(hoursPerDay?.value || '8'),
      workingDaysPerWeek: parseFloat(daysPerWeek?.value || '5'),
      timeFormat: format?.value || 'pretty',
      defaultUnit: 'hour',
    };
  }

  async updateTimeTrackingConfiguration(config: any) {
    if (config.workingHoursPerDay) {
      await this.updateOrCreateProperty('jira.timetracking.hours.per.day', config.workingHoursPerDay.toString());
    }
    if (config.workingDaysPerWeek) {
      await this.updateOrCreateProperty('jira.timetracking.days.per.week', config.workingDaysPerWeek.toString());
    }
    if (config.timeFormat) {
      await this.updateOrCreateProperty('jira.timetracking.format', config.timeFormat);
    }
    return this.getTimeTrackingConfiguration();
  }

  async getTimeTrackingList() {
    return {
      formats: ['pretty', 'days', 'hours'],
      defaultUnits: ['minute', 'hour', 'day', 'week'],
    };
  }

  // ========== APPLICATION PROPERTIES ==========

  async getApplicationProperties(key?: string) {
    if (key) {
      const prop = await this.applicationPropertyRepository.findOne({ where: { key } });
      return prop ? [prop] : [];
    }
    return this.applicationPropertyRepository.find({ order: { category: 'ASC', key: 'ASC' } });
  }

  async getAdvancedSettings() {
    return this.applicationPropertyRepository.find({
      where: { category: 'Advanced' },
      order: { key: 'ASC' },
    });
  }

  async getApplicationProperty(id: string) {
    const prop = await this.applicationPropertyRepository.findOne({ where: { id } });
    if (!prop) throw new NotFoundException(`Application property ${id} not found`);
    return prop;
  }

  async updateApplicationProperty(id: string, dto: UpdateApplicationPropertyDto) {
    const prop = await this.getApplicationProperty(id);
    Object.assign(prop, dto);
    prop.updatedAt = new Date();
    return this.applicationPropertyRepository.save(prop);
  }

  private async updateOrCreateProperty(key: string, value: string) {
    let prop = await this.applicationPropertyRepository.findOne({ where: { key } });
    if (!prop) {
      prop = this.applicationPropertyRepository.create({ key, value, createdAt: new Date(), updatedAt: new Date() });
    } else {
      prop.value = value;
      prop.updatedAt = new Date();
    }
    return this.applicationPropertyRepository.save(prop);
  }

  // ========== PRIORITIES ==========

  async getPriorities() {
    return this.priorityRepository.find({ where: { isActive: true }, order: { sequence: 'ASC' } });
  }

  async createPriority(dto: CreatePriorityDto) {
    const priority = this.priorityRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.priorityRepository.save(priority);
  }

  async getPriority(id: string) {
    const priority = await this.priorityRepository.findOne({ where: { id } });
    if (!priority) throw new NotFoundException(`Priority ${id} not found`);
    return priority;
  }

  async updatePriority(id: string, dto: UpdatePriorityDto) {
    const priority = await this.getPriority(id);
    Object.assign(priority, dto);
    priority.updatedAt = new Date();
    return this.priorityRepository.save(priority);
  }

  async deletePriority(id: string) {
    const priority = await this.getPriority(id);
    await this.priorityRepository.remove(priority);
  }

  // ========== ISSUE TYPES ==========

  async getIssueTypes() {
    return this.issueTypeRepository.find({ where: { isActive: true }, order: { name: 'ASC' } });
  }

  async createIssueType(dto: CreateIssueTypeDto) {
    const issueType = this.issueTypeRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.issueTypeRepository.save(issueType);
  }

  async getIssueType(id: string) {
    const issueType = await this.issueTypeRepository.findOne({ where: { id } });
    if (!issueType) throw new NotFoundException(`Issue type ${id} not found`);
    return issueType;
  }

  async updateIssueType(id: string, dto: UpdateIssueTypeDto) {
    const issueType = await this.getIssueType(id);
    Object.assign(issueType, dto);
    issueType.updatedAt = new Date();
    return this.issueTypeRepository.save(issueType);
  }

  async deleteIssueType(id: string) {
    const issueType = await this.getIssueType(id);
    await this.issueTypeRepository.remove(issueType);
  }

  // ========== RESOLUTIONS ==========

  async getResolutions() {
    return this.resolutionRepository.find({ where: { isActive: true }, order: { sequence: 'ASC' } });
  }

  async createResolution(dto: CreateResolutionDto) {
    const resolution = this.resolutionRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.resolutionRepository.save(resolution);
  }

  async getResolution(id: string) {
    const resolution = await this.resolutionRepository.findOne({ where: { id } });
    if (!resolution) throw new NotFoundException(`Resolution ${id} not found`);
    return resolution;
  }

  async updateResolution(id: string, dto: UpdateResolutionDto) {
    const resolution = await this.getResolution(id);
    Object.assign(resolution, dto);
    resolution.updatedAt = new Date();
    return this.resolutionRepository.save(resolution);
  }

  async deleteResolution(id: string) {
    const resolution = await this.getResolution(id);
    await this.resolutionRepository.remove(resolution);
  }

  // ========== STATUSES ==========

  async getStatuses() {
    return this.statusRepository.find({ order: { name: 'ASC' } });
  }

  async createStatus(dto: CreateStatusDto) {
    const status = this.statusRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.statusRepository.save(status);
  }

  async getStatus(id: string) {
    const status = await this.statusRepository.findOne({ where: { id } });
    if (!status) throw new NotFoundException(`Status ${id} not found`);
    return status;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const status = await this.getStatus(id);
    Object.assign(status, dto);
    status.updatedAt = new Date();
    return this.statusRepository.save(status);
  }

  async deleteStatus(id: string) {
    const status = await this.getStatus(id);
    await this.statusRepository.remove(status);
  }

  // ========== SETTINGS ==========

  async getColumnSettings() {
    const settings = await this.applicationPropertyRepository.findOne({
      where: { key: 'jira.table.cols.issue' },
    });
    return settings?.value ? JSON.parse(settings.value) : ['issuekey', 'summary', 'status', 'assignee'];
  }

  async updateColumnSettings(settings: any) {
    await this.updateOrCreateProperty('jira.table.cols.issue', JSON.stringify(settings));
    return this.getColumnSettings();
  }
}
