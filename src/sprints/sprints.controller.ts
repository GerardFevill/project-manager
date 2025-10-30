import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { SprintStatus } from './enums/sprint-status.enum';

@Controller('sprints')
export class SprintsController {
  constructor(private readonly sprintsService: SprintsService) {}

  @Post()
  create(@Body() createSprintDto: CreateSprintDto) {
    return this.sprintsService.create(createSprintDto);
  }

  @Get()
  findAll(
    @Query('status') status?: SprintStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.sprintsService.findAll({
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('active')
  findActive() {
    return this.sprintsService.findActiveSprint();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSprintDto: UpdateSprintDto,
  ) {
    return this.sprintsService.update(id, updateSprintDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.remove(id);
  }

  @Post(':id/start')
  startSprint(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.startSprint(id);
  }

  @Post(':id/complete')
  completeSprint(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.completeSprint(id);
  }

  @Get(':id/tasks')
  getSprintTasks(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.getSprintTasks(id);
  }

  @Get(':id/details')
  getSprintDetails(@Param('id', ParseIntPipe) id: number) {
    return this.sprintsService.getSprintDetails(id);
  }

  @Post(':id/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  assignTaskToSprint(
    @Param('id', ParseIntPipe) sprintId: number,
    @Param('taskId') taskId: string,
  ) {
    return this.sprintsService.assignTaskToSprint(sprintId, taskId);
  }

  @Delete(':id/tasks/:taskId')
  @HttpCode(HttpStatus.OK)
  removeTaskFromSprint(
    @Param('id', ParseIntPipe) sprintId: number,
    @Param('taskId') taskId: string,
  ) {
    return this.sprintsService.removeTaskFromSprint(sprintId, taskId);
  }
}
