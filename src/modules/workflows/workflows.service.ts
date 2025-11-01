import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly workflowRepository: Repository<Workflow>,
  ) {}

  async findAll(): Promise<Workflow[]> {
    return this.workflowRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Workflow> {
    const workflow = await this.workflowRepository.findOne({ where: { id } });

    if (!workflow) {
      throw new NotFoundException(`Workflow with ID ${id} not found`);
    }

    return workflow;
  }

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const workflow = this.workflowRepository.create({
      ...createWorkflowDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.workflowRepository.save(workflow);
  }

  async update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<Workflow> {
    const workflow = await this.findOne(id);

    Object.assign(workflow, updateWorkflowDto);
    workflow.updatedAt = new Date();

    return this.workflowRepository.save(workflow);
  }

  async remove(id: string): Promise<void> {
    const workflow = await this.findOne(id);
    await this.workflowRepository.remove(workflow);
  }
}

  // ========== WORKFLOW TRANSITIONS ==========

  async getWorkflowTransitions(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Get from workflow_transitions table
    return { workflowId: id, transitions: [] };
  }

  async updateWorkflowTransition(workflowId: string, transitionId: string, data: any): Promise<any> {
    await this.findOne(workflowId);
    // TODO: Update in workflow_transitions table
    return { workflowId, transitionId, updated: true };
  }

  // ========== WORKFLOW PUBLISHING ==========

  async publishWorkflow(id: string): Promise<any> {
    const workflow = await this.findOne(id);
    // TODO: Mark as published
    return { workflowId: id, published: true };
  }

  async getDraftWorkflow(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Get draft version
    return { workflowId: id, draft: null };
  }

  async createDraftWorkflow(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Create draft copy
    return { workflowId: id, draft: {} };
  }

  // ========== WORKFLOW PROPERTIES ==========

  async updateWorkflowProperties(id: string, properties: any): Promise<any> {
    const workflow = await this.findOne(id);
    // TODO: Store properties
    return { workflowId: id, properties };
  }

  // ========== WORKFLOW SCHEMES ==========

  async getWorkflowSchemesForProjects(projectIds: string): Promise<any> {
    // TODO: Get workflow schemes for projects
    return { projects: [] };
  }

  // ========== TRANSITION RULES ==========

  async addTransitionRules(rules: any): Promise<any> {
    // TODO: Add transition rules
    return { rules };
  }
}
