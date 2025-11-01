import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('programs')
@Controller('programs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a program' })
  @ApiResponse({ status: 201, description: 'Program successfully created' })
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiQuery({ name: 'portfolioId', required: false })
  @ApiResponse({ status: 200, description: 'Returns list of programs' })
  findAll(@Query('portfolioId') portfolioId?: string) {
    return this.programsService.findAll(portfolioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  @ApiResponse({ status: 200, description: 'Returns program details' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update program' })
  @ApiResponse({ status: 200, description: 'Program successfully updated' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  update(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
    return this.programsService.update(id, updateProgramDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete program' })
  @ApiResponse({ status: 204, description: 'Program successfully deleted' })
  @ApiResponse({ status: 404, description: 'Program not found' })
  async remove(@Param('id') id: string) {
    await this.programsService.remove(id);
  }

  @Post(':id/projects/:projectId')
  @ApiOperation({ summary: 'Add project to program' })
  @ApiResponse({ status: 200, description: 'Project added to program' })
  addProject(@Param('id') programId: string, @Param('projectId') projectId: string) {
    return this.programsService.addProject(programId, projectId);
  }

  @Delete(':id/projects/:projectId')
  @ApiOperation({ summary: 'Remove project from program' })
  @ApiResponse({ status: 200, description: 'Project removed from program' })
  removeProject(@Param('id') programId: string, @Param('projectId') projectId: string) {
    return this.programsService.removeProject(programId, projectId);
  }
}
