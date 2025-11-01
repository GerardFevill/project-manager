import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('boards')
@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of boards' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.boardsService.findAll(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all boards for a project' })
  @ApiResponse({ status: 200, description: 'Returns list of boards for the project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.boardsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by ID' })
  @ApiResponse({ status: 200, description: 'Returns board details' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'Board successfully created' })
  @ApiResponse({ status: 400, description: 'Project not found' })
  async create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.create(createBoardDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update board by ID' })
  @ApiResponse({ status: 200, description: 'Board successfully updated' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(id, updateBoardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete board by ID' })
  @ApiResponse({ status: 204, description: 'Board successfully deleted' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}
