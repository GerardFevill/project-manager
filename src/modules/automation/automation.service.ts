import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationRule } from './entities/automation-rule.entity';

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(AutomationRule)
    private readonly ruleRepository: Repository<AutomationRule>,
  ) {}

  async create(data: Partial<AutomationRule>): Promise<AutomationRule> {
    const rule = this.ruleRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.ruleRepository.save(rule);
  }

  async findAll(projectId?: string): Promise<AutomationRule[]> {
    const query: any = {};
    if (projectId) query.projectId = projectId;
    return this.ruleRepository.find({ where: query, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<AutomationRule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) throw new NotFoundException(`Automation rule with ID ${id} not found`);
    return rule;
  }

  async update(id: string, data: Partial<AutomationRule>): Promise<AutomationRule> {
    const rule = await this.findOne(id);
    Object.assign(rule, data);
    rule.updatedAt = new Date();
    return this.ruleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.ruleRepository.remove(rule);
  }

  async execute(triggerEvent: string, payload: Record<string, any>, projectId?: string): Promise<void> {
    const rules = await this.ruleRepository.find({
      where: { triggerEvent, isActive: true, projectId: projectId || null },
    });

    for (const rule of rules) {
      if (this.matchesConditions(rule.conditions, payload)) {
        await this.executeActions(rule.actions, payload);
        rule.executionCount++;
        rule.lastExecutedAt = new Date();
        await this.ruleRepository.save(rule);
      }
    }
  }

  private matchesConditions(conditions: Record<string, any>, payload: Record<string, any>): boolean {
    // TODO: Implement condition matching logic
    return true; // Simplified for now
  }

  private async executeActions(actions: Array<{ type: string; config: Record<string, any> }>, payload: Record<string, any>): Promise<void> {
    // TODO: Implement action execution logic
    console.log('Executing actions:', actions);
  }
}
