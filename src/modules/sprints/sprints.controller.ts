import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sprints')
@Controller('sprints')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sprints' })
  @ApiQuery({ name: 'boardId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of sprints' })
  async findAll(@Query('boardId') boardId?: string) {
    return this.sprintsService.findAll(boardId);
  }

  @Get('board/:boardId')
  @ApiOperation({ summary: 'Get all sprints for a board' })
  @ApiResponse({ status: 200, description: 'Returns list of sprints for the board' })
  async findByBoard(@Param('boardId') boardId: string) {
    return this.sprintsService.findByBoard(boardId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sprint by ID' })
  @ApiResponse({ status: 200, description: 'Returns sprint details' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  async findOne(@Param('id') id: string) {
    return this.sprintsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new sprint' })
  @ApiResponse({ status: 201, description: 'Sprint successfully created' })
  @ApiResponse({ status: 400, description: 'Board not found' })
  async create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintsService.create(createSprintDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sprint by ID' })
  @ApiResponse({ status: 200, description: 'Sprint successfully updated' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  async update(@Param('id') id: string, @Body() updateSprintDto: UpdateSprintDto) {
    return this.sprintsService.update(id, updateSprintDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete sprint by ID' })
  @ApiResponse({ status: 204, description: 'Sprint successfully deleted' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  async remove(@Param('id') id: string) {
    return this.sprintsService.remove(id);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start sprint' })
  @ApiResponse({ status: 200, description: 'Sprint successfully started' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  async start(@Param('id') id: string) {
    return this.sprintsService.start(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete sprint' })
  @ApiResponse({ status: 200, description: 'Sprint successfully completed' })
  @ApiResponse({ status: 404, description: 'Sprint not found' })
  async complete(@Param('id') id: string) {
    return this.sprintsService.complete(id);
  }
}
