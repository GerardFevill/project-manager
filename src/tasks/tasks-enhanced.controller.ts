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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks-enhanced.service';
import { CreateTaskDto } from './dto/create-task-enhanced.dto';
import { UpdateTaskDto } from './dto/update-task-enhanced.dto';
import { TaskFilterDto } from './dto/task-filter-enhanced.dto';
import { BlockTaskDto } from './dto/task-action.dto';

/**
 * 🌀 TASKS CONTROLLER ENHANCED - API REST COMPLÈTE
 *
 * Controller avec tous les endpoints avancés:
 * ✅ CRUD complet
 * ✅ Actions spécialisées (block, archive, toggle, etc.)
 * ✅ Navigation hiérarchique (children, tree, ancestors)
 * ✅ Analytics & statistiques
 * ✅ Gestion de la récurrence
 * ✅ Historique et audit trail
 */
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ============================================================================
  // CREATE
  // ============================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer une nouvelle tâche',
    description: 'Crée une tâche avec support complet de la hiérarchie et récurrence',
  })
  @ApiResponse({ status: 201, description: 'Tâche créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // ============================================================================
  // READ - Liste et filtres
  // ============================================================================

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les tâches',
    description: 'Supporte 15+ filtres avancés, pagination et tri',
  })
  @ApiResponse({ status: 200, description: 'Liste des tâches' })
  findAll(@Query() filters: TaskFilterDto) {
    return this.tasksService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Statistiques globales',
    description: 'Métriques complètes: statuts, priorités, taux de complétion, etc.',
  })
  @ApiResponse({ status: 200, description: 'Statistiques' })
  getStats() {
    return this.tasksService.getStatistics();
  }

  @Get('recurring/upcoming')
  @ApiOperation({
    summary: 'Prochaines occurrences de tâches récurrentes',
    description: 'Tâches récurrentes à venir dans les N prochains jours',
  })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  @ApiResponse({ status: 200, description: 'Liste des tâches à venir' })
  getUpcomingRecurrences(@Query('days') days: string = '7') {
    return this.tasksService.getUpcomingRecurrences(parseInt(days, 10));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une tâche par ID' })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiQuery({
    name: 'includeRelations',
    required: false,
    type: Boolean,
    description: 'Inclure parent, enfants et historique',
  })
  @ApiResponse({ status: 200, description: 'Tâche trouvée' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeRelations') includeRelations?: string,
  ) {
    return this.tasksService.findOne(id, includeRelations === 'true');
  }

  // ============================================================================
  // READ - Hiérarchie
  // ============================================================================

  @Get(':id/children')
  @ApiOperation({
    summary: 'Récupérer les enfants directs',
    description: 'Sous-tâches de niveau 1 uniquement',
  })
  @ApiParam({ name: 'id', description: 'UUID du parent' })
  @ApiResponse({ status: 200, description: 'Liste des enfants' })
  findChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findChildren(id);
  }

  @Get(':id/tree')
  @ApiOperation({
    summary: 'Récupérer l\'arbre complet (récursif)',
    description: 'Tous les descendants à tous les niveaux',
  })
  @ApiParam({ name: 'id', description: 'UUID de la racine' })
  @ApiResponse({ status: 200, description: 'Arbre complet' })
  findTree(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findTree(id);
  }

  @Get(':id/ancestors')
  @ApiOperation({
    summary: 'Récupérer les ancêtres',
    description: 'Tous les parents jusqu\'à la racine',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Liste des ancêtres' })
  findAncestors(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findAncestors(id);
  }

  // ============================================================================
  // READ - Analytics & Historique
  // ============================================================================

  @Get(':id/progress')
  @ApiOperation({
    summary: 'Progression détaillée',
    description: 'Métriques de progression avec timeline et enfants',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Détails de progression' })
  getTaskProgress(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getTaskProgress(id);
  }

  @Get(':id/history')
  @ApiOperation({
    summary: 'Historique complet',
    description: 'Audit trail de toutes les actions sur la tâche',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Historique des actions' })
  getTaskHistory(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getTaskHistory(id);
  }

  // ============================================================================
  // UPDATE - Basique
  // ============================================================================

  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour une tâche',
    description: 'Mise à jour partielle avec recalcul auto des champs dérivés',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche mise à jour' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  // ============================================================================
  // UPDATE - Actions spécialisées
  // ============================================================================

  @Patch(':id/toggle')
  @ApiOperation({
    summary: 'Toggle complétion',
    description: 'Bascule entre ACTIVE et COMPLETED',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Statut basculé' })
  toggleCompletion(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.toggleCompletion(id);
  }

  @Post(':id/block')
  @ApiOperation({
    summary: 'Bloquer une tâche',
    description: 'Passe au statut BLOCKED avec raison optionnelle',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche bloquée' })
  blockTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() blockDto: BlockTaskDto,
  ) {
    return this.tasksService.blockTask(id, blockDto.reason);
  }

  @Post(':id/convert-to-project')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Convertir une tâche en projet',
    description: 'Change le type de la tâche en PROJECT (impossible pour les milestones)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche convertie en projet' })
  @ApiResponse({ status: 400, description: 'Impossible de convertir (milestone)' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  convertToProject(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.convertToProject(id);
  }

  @Post(':id/unblock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Débloquer une tâche',
    description: 'Passe de BLOCKED à ACTIVE',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche débloquée' })
  unblockTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.unblockTask(id);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archiver une tâche',
    description: 'Soft delete - passe au statut ARCHIVED',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche archivée' })
  archiveTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.archiveTask(id);
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Restaurer une tâche archivée',
    description: 'Restaure le statut précédent',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 200, description: 'Tâche restaurée' })
  unarchiveTask(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.unarchiveTask(id);
  }

  @Post(':id/next-occurrence')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculer prochaine occurrence',
    description: 'Pour tâches récurrentes uniquement',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche récurrente' })
  @ApiResponse({ status: 200, description: 'Occurrence calculée' })
  @ApiResponse({ status: 400, description: 'Tâche non récurrente' })
  moveToNextOccurrence(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.moveToNextOccurrence(id);
  }

  @Post(':id/calculate-progress')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recalculer progression',
    description: 'Basé sur la moyenne des enfants',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche parente' })
  @ApiResponse({ status: 200, description: 'Progression recalculée' })
  calculateProgressFromChildren(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.calculateProgressFromChildren(id);
  }

  // ============================================================================
  // DELETE
  // ============================================================================

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une tâche',
    description: 'Hard delete - supprime la tâche et tous ses enfants (cascade)',
  })
  @ApiParam({ name: 'id', description: 'UUID de la tâche' })
  @ApiResponse({ status: 204, description: 'Tâche supprimée' })
  @ApiResponse({ status: 404, description: 'Tâche non trouvée' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
