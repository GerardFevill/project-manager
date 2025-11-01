import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dashboard, DashboardScope } from './entities/dashboard.entity';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: Repository<Dashboard>,
    @InjectRepository(DashboardWidget)
    private readonly widgetRepository: Repository<DashboardWidget>,
  ) {}

  // Dashboard Management
  async create(createDashboardDto: CreateDashboardDto, ownerId: string): Promise<Dashboard> {
    const dashboard = this.dashboardRepository.create({
      ...createDashboardDto,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.dashboardRepository.save(dashboard);
  }

  async findAll(userId: string): Promise<Dashboard[]> {
    return this.dashboardRepository
      .createQueryBuilder('dashboard')
      .where('dashboard.ownerId = :userId', { userId })
      .orWhere('dashboard.scope = :scope', { scope: DashboardScope.GLOBAL })
      .orWhere(':userId = ANY(dashboard.sharedWith)', { userId })
      .leftJoinAndSelect('dashboard.widgets', 'widgets')
      .orderBy('dashboard.name', 'ASC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findOne({
      where: { id },
      relations: ['owner', 'widgets'],
    });

    if (!dashboard) {
      throw new NotFoundException(`Dashboard with ID ${id} not found`);
    }

    this.checkAccess(dashboard, userId);

    return dashboard;
  }

  async findFavorites(userId: string): Promise<Dashboard[]> {
    return this.dashboardRepository.find({
      where: { ownerId: userId, isFavorite: true },
      relations: ['widgets'],
      order: { name: 'ASC' },
    });
  }

  async findDefault(userId: string): Promise<Dashboard | null> {
    return this.dashboardRepository.findOne({
      where: { ownerId: userId, isDefault: true },
      relations: ['widgets'],
    });
  }

  async update(id: string, updateDashboardDto: UpdateDashboardDto, userId: string): Promise<Dashboard> {
    const dashboard = await this.findOne(id, userId);

    if (dashboard.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can update this dashboard');
    }

    Object.assign(dashboard, updateDashboardDto);
    dashboard.updatedAt = new Date();

    return this.dashboardRepository.save(dashboard);
  }

  async remove(id: string, userId: string): Promise<void> {
    const dashboard = await this.findOne(id, userId);

    if (dashboard.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete this dashboard');
    }

    await this.dashboardRepository.remove(dashboard);
  }

  async clone(id: string, userId: string, name: string): Promise<Dashboard> {
    const original = await this.findOne(id, userId);

    const cloned = this.dashboardRepository.create({
      name,
      description: original.description,
      scope: DashboardScope.PRIVATE,
      ownerId: userId,
      layout: original.layout,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedDashboard = await this.dashboardRepository.save(cloned);

    // Clone widgets
    if (original.widgets && original.widgets.length > 0) {
      const clonedWidgets = original.widgets.map(widget =>
        this.widgetRepository.create({
          dashboardId: savedDashboard.id,
          title: widget.title,
          type: widget.type,
          config: widget.config,
          positionX: widget.positionX,
          positionY: widget.positionY,
          width: widget.width,
          height: widget.height,
          refreshInterval: widget.refreshInterval,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      await this.widgetRepository.save(clonedWidgets);
    }

    return this.findOne(savedDashboard.id, userId);
  }

  // Widget Management
  async addWidget(dashboardId: string, createWidgetDto: CreateWidgetDto, userId: string): Promise<DashboardWidget> {
    const dashboard = await this.findOne(dashboardId, userId);

    if (dashboard.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can add widgets');
    }

    const widget = this.widgetRepository.create({
      dashboardId,
      ...createWidgetDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.widgetRepository.save(widget);
  }

  async updateWidget(widgetId: string, updateWidgetDto: UpdateWidgetDto, userId: string): Promise<DashboardWidget> {
    const widget = await this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['dashboard'],
    });

    if (!widget) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }

    if (widget.dashboard.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can update widgets');
    }

    Object.assign(widget, updateWidgetDto);
    widget.updatedAt = new Date();

    return this.widgetRepository.save(widget);
  }

  async removeWidget(widgetId: string, userId: string): Promise<void> {
    const widget = await this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['dashboard'],
    });

    if (!widget) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }

    if (widget.dashboard.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can remove widgets');
    }

    await this.widgetRepository.remove(widget);
  }

  async getWidgetData(widgetId: string, userId: string): Promise<any> {
    const widget = await this.widgetRepository.findOne({
      where: { id: widgetId },
      relations: ['dashboard'],
    });

    if (!widget) {
      throw new NotFoundException(`Widget with ID ${widgetId} not found`);
    }

    this.checkAccess(widget.dashboard, userId);

    // TODO: Implement data fetching based on widget type
    // This would query different services based on widget.type
    return {
      widgetId: widget.id,
      type: widget.type,
      data: null,
      message: 'Widget data fetching not yet implemented',
    };
  }

  private checkAccess(dashboard: Dashboard, userId: string): void {
    const hasAccess =
      dashboard.ownerId === userId ||
      dashboard.scope === DashboardScope.GLOBAL ||
      (dashboard.sharedWith && dashboard.sharedWith.includes(userId));

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this dashboard');
    }
  }
}
