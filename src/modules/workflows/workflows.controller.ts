import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('workflows')
@Controller('workflows')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workflows' })
  @ApiResponse({ status: 200, description: 'Returns list of workflows' })
  async findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  @ApiResponse({ status: 200, description: 'Returns workflow details' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new workflow' })
  @ApiResponse({ status: 201, description: 'Workflow successfully created' })
  async create(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowsService.create(createWorkflowDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow by ID' })
  @ApiResponse({ status: 200, description: 'Workflow successfully updated' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowsService.update(id, updateWorkflowDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete workflow by ID' })
  @ApiResponse({ status: 204, description: 'Workflow successfully deleted' })
  @ApiResponse({ status: 404, description: 'Workflow not found' })
  async remove(@Param('id') id: string) {
    return this.workflowsService.remove(id);
  }

  // ========== WORKFLOW TRANSITIONS ==========

  @Get(':id/transitions')
  @ApiOperation({ summary: 'Get all transitions for workflow' })
  getWorkflowTransitions(@Param('id') id: string) {
    return { workflowId: id, transitions: [] };
  }

  @Put(':id/transitions/:transitionId')
  @ApiOperation({ summary: 'Update workflow transition' })
  updateWorkflowTransition(@Param('id') id: string, @Param('transitionId') transitionId: string, @Body() dto: any) {
    return { workflowId: id, transitionId, updated: true };
  }

  // ========== WORKFLOW PUBLISHING ==========

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish workflow' })
  publishWorkflow(@Param('id') id: string) {
    return { workflowId: id, published: true };
  }

  @Get(':id/draft')
  @ApiOperation({ summary: 'Get draft workflow' })
  getDraftWorkflow(@Param('id') id: string) {
    return { workflowId: id, draft: null };
  }

  @Post(':id/draft')
  @ApiOperation({ summary: 'Create draft workflow' })
  createDraftWorkflow(@Param('id') id: string) {
    return { workflowId: id, draft: {} };
  }

  // ========== WORKFLOW PROPERTIES ==========

  @Put(':id/properties')
  @ApiOperation({ summary: 'Update workflow properties' })
  updateWorkflowProperties(@Param('id') id: string, @Body() dto: any) {
    return { workflowId: id, properties: dto };
  }

  // ========== WORKFLOW SCHEMES ==========

  @Get('schemes/projects')
  @ApiOperation({ summary: 'Get workflow schemes for projects' })
  getWorkflowSchemesForProjects(@Query('projectIds') projectIds: string) {
    return { projects: [] };
  }

  // ========== TRANSITION RULES ==========

  @Post('transitions/rules')
  @ApiOperation({ summary: 'Add transition rules' })
  addTransitionRules(@Body() dto: any) {
    return { rules: dto };
  }
}
