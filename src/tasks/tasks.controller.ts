import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

/**
 * 🌀 TASKS CONTROLLER - API REST FRACTALE
 *
 * Endpoints pour gérer les tâches de manière hiérarchique
 */
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * POST /tasks
   * Créer une nouvelle tâche
   *
   * Body: CreateTaskDto
   * - title: string (required)
   * - description?: string
   * - dueDate?: string (ISO date)
   * - priority?: 'low' | 'medium' | 'high' | 'urgent'
   * - parentId?: string (UUID) - pour créer une sous-tâche
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * GET /tasks
   * Récupérer toutes les tâches avec filtres optionnels
   *
   * Query params:
   * - status?: 'all' | 'active' | 'completed' (default: 'all')
   * - priority?: 'low' | 'medium' | 'high' | 'urgent'
   * - onlyOverdue?: boolean
   * - onlyRoot?: boolean (seulement les tâches racines)
   * - parentId?: string (UUID) - filtrer par parent
   */
  @Get()
  findAll(@Query() filters: TaskFilterDto) {
    return this.tasksService.findAll(filters);
  }

  /**
   * GET /tasks/stats
   * Obtenir les statistiques globales
   *
   * Returns: { total, active, completed, overdue, completionRate }
   */
  @Get('stats')
  getStats() {
    return this.tasksService.getStats();
  }

  /**
   * GET /tasks/:id
   * Récupérer une tâche spécifique par ID
   *
   * Params:
   * - id: string (UUID)
   *
   * Query params:
   * - includeRelations?: boolean (inclure parent et enfants)
   */
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: string,
  ) {
    return this.tasksService.findOne(id, includeRelations === 'true');
  }

  /**
   * GET /tasks/:id/children
   * Récupérer les sous-tâches directes d'une tâche
   *
   * Params:
   * - id: string (UUID)
   */
  @Get(':id/children')
  findChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findChildren(id);
  }

  /**
   * GET /tasks/:id/tree
   * Récupérer l'arbre complet d'une tâche (récursif)
   *
   * Params:
   * - id: string (UUID)
   */
  @Get(':id/tree')
  findTree(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findTree(id);
  }

  /**
   * PATCH /tasks/:id
   * Mettre à jour une tâche
   *
   * Params:
   * - id: string (UUID)
   *
   * Body: UpdateTaskDto (tous les champs optionnels)
   * - title?: string
   * - description?: string
   * - completed?: boolean
   * - dueDate?: string
   * - priority?: 'low' | 'medium' | 'high' | 'urgent'
   * - parentId?: string (UUID) - déplacer dans la hiérarchie
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  /**
   * PATCH /tasks/:id/toggle
   * Toggle le statut completed d'une tâche
   *
   * Params:
   * - id: string (UUID)
   */
  @Patch(':id/toggle')
  toggle(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.toggle(id);
  }

  /**
   * DELETE /tasks/:id
   * Supprimer une tâche et tous ses enfants (cascade)
   *
   * Params:
   * - id: string (UUID)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
