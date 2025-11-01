import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screen } from './entities/Screen.entity';
import { ScreenTab } from './entities/ScreenTab.entity';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';
import { CreateScreenTabDto, UpdateScreenTabDto, AddFieldToTabDto } from './dto/screen-tab.dto';

@Injectable()
export class ScreensService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
    @InjectRepository(ScreenTab)
    private readonly screenTabRepository: Repository<ScreenTab>,
  ) {}

  // ========== SCREENS ==========

  async getScreens() {
    return this.screenRepository.find({
      relations: ['tabs'],
      order: { createdAt: 'DESC' },
    });
  }

  async createScreen(dto: CreateScreenDto) {
    const screen = this.screenRepository.create({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.screenRepository.save(screen);
  }

  async getScreen(id: string) {
    const screen = await this.screenRepository.findOne({
      where: { id },
      relations: ['tabs'],
    });
    if (!screen) throw new NotFoundException(`Screen ${id} not found`);
    return screen;
  }

  async updateScreen(id: string, dto: UpdateScreenDto) {
    const screen = await this.getScreen(id);
    Object.assign(screen, dto);
    screen.updatedAt = new Date();
    return this.screenRepository.save(screen);
  }

  async deleteScreen(id: string) {
    const screen = await this.getScreen(id);
    await this.screenRepository.remove(screen);
  }

  async getAvailableFields(screenId: string) {
    // Return list of available system and custom fields
    return [
      { id: 'summary', name: 'Summary', type: 'text', required: true },
      { id: 'description', name: 'Description', type: 'textarea', required: false },
      { id: 'assignee', name: 'Assignee', type: 'user', required: false },
      { id: 'reporter', name: 'Reporter', type: 'user', required: false },
      { id: 'priority', name: 'Priority', type: 'priority', required: false },
      { id: 'status', name: 'Status', type: 'status', required: false },
      { id: 'labels', name: 'Labels', type: 'labels', required: false },
      { id: 'dueDate', name: 'Due Date', type: 'date', required: false },
      { id: 'environment', name: 'Environment', type: 'text', required: false },
      { id: 'components', name: 'Components', type: 'multiselect', required: false },
    ];
  }

  // ========== SCREEN TABS ==========

  async getScreenTabs(screenId: string) {
    return this.screenTabRepository.find({
      where: { screenId },
      order: { position: 'ASC' },
    });
  }

  async createScreenTab(screenId: string, dto: CreateScreenTabDto) {
    // Verify screen exists
    await this.getScreen(screenId);

    const tab = this.screenTabRepository.create({
      ...dto,
      screenId,
      fields: dto.fields || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.screenTabRepository.save(tab);
  }

  async getScreenTab(tabId: string) {
    const tab = await this.screenTabRepository.findOne({ where: { id: tabId } });
    if (!tab) throw new NotFoundException(`Screen tab ${tabId} not found`);
    return tab;
  }

  async updateScreenTab(tabId: string, dto: UpdateScreenTabDto) {
    const tab = await this.getScreenTab(tabId);
    Object.assign(tab, dto);
    tab.updatedAt = new Date();
    return this.screenTabRepository.save(tab);
  }

  async deleteScreenTab(tabId: string) {
    const tab = await this.getScreenTab(tabId);
    await this.screenTabRepository.remove(tab);
  }

  // ========== TAB FIELDS ==========

  async getTabFields(tabId: string) {
    const tab = await this.getScreenTab(tabId);
    return tab.fields;
  }

  async addFieldToTab(tabId: string, dto: AddFieldToTabDto) {
    const tab = await this.getScreenTab(tabId);

    if (!tab.fields.includes(dto.fieldId)) {
      tab.fields.push(dto.fieldId);
      tab.updatedAt = new Date();
      await this.screenTabRepository.save(tab);
    }

    return { fieldId: dto.fieldId, added: true };
  }

  async removeFieldFromTab(tabId: string, fieldId: string) {
    const tab = await this.getScreenTab(tabId);
    tab.fields = tab.fields.filter((f) => f !== fieldId);
    tab.updatedAt = new Date();
    await this.screenTabRepository.save(tab);
  }

  async getAllTabFields(tabId: string) {
    const tab = await this.getScreenTab(tabId);
    const availableFields = await this.getAvailableFields(tab.screenId);

    return tab.fields.map((fieldId) => {
      const field = availableFields.find((f) => f.id === fieldId);
      return field || { id: fieldId, name: fieldId, type: 'unknown' };
    });
  }

  async addFieldToDefaultScreen(fieldId: string) {
    // Find or create default screen
    let defaultScreen = await this.screenRepository.findOne({
      where: { name: 'Default Screen' },
      relations: ['tabs'],
    });

    if (!defaultScreen) {
      defaultScreen = await this.createScreen({
        name: 'Default Screen',
        description: 'Default screen for all projects',
      });
    }

    // Find or create default tab
    let defaultTab = await this.screenTabRepository.findOne({
      where: { screenId: defaultScreen.id, name: 'Field Tab' },
    });

    if (!defaultTab) {
      defaultTab = await this.createScreenTab(defaultScreen.id, {
        name: 'Field Tab',
        position: 0,
      });
    }

    // Add field to tab
    await this.addFieldToTab(defaultTab.id, { fieldId });

    return { screenId: defaultScreen.id, tabId: defaultTab.id, fieldId };
  }
}
