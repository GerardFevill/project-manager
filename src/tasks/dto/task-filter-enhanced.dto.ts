import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  IsArray,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskRecurrence } from '../enums/task-recurrence.enum';
import { TaskType } from '../enums/task-type.enum';

/**
 * 🔍 DTO - FILTRES AVANCÉS POUR REQUÊTES
 *
 * Permet des filtres complexes et combinés
 */
export class TaskFilterDto {
  @ApiPropertyOptional({
    description: 'Filtrer par statut',
    enum: [...Object.values(TaskStatus), 'all'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  status?: TaskStatus | 'all';

  @ApiPropertyOptional({
    description: 'Filtrer par plusieurs statuts',
    type: [String],
    enum: Object.values(TaskStatus),
    example: ['active', 'blocked'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  statuses?: TaskStatus[];

  @ApiPropertyOptional({
    description: 'Filtrer par priorité',
    enum: ['low', 'medium', 'high', 'urgent'],
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @ApiPropertyOptional({
    description: 'Filtrer par plusieurs priorités',
    type: [String],
    enum: ['low', 'medium', 'high', 'urgent'],
    example: ['high', 'urgent'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  priorities?: ('low' | 'medium' | 'high' | 'urgent')[];

  @ApiPropertyOptional({
    description: 'Filtrer par type de tâche',
    enum: TaskType,
  })
  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @ApiPropertyOptional({
    description: 'Filtrer par plusieurs types de tâches',
    type: [String],
    enum: Object.values(TaskType),
    example: ['project', 'epic'],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  types?: TaskType[];

  @ApiPropertyOptional({
    description: 'Filtrer par type de récurrence',
    enum: TaskRecurrence,
  })
  @IsOptional()
  @IsEnum(TaskRecurrence)
  recurrence?: TaskRecurrence;

  @ApiPropertyOptional({
    description: 'Uniquement les tâches racines (level 0)',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onlyRoot?: boolean;

  @ApiPropertyOptional({
    description: 'Uniquement les tâches en retard',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onlyOverdue?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrer par parent (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Filtrer par tags (AND)',
    type: [String],
    example: ['urgent', 'backend'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Recherche textuelle (titre + description)',
    example: 'notification',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Inclure les tâches archivées',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeArchived?: boolean;

  @ApiPropertyOptional({
    description: 'Progression minimale (%)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressMin?: number;

  @ApiPropertyOptional({
    description: 'Progression maximale (%)',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressMax?: number;

  @ApiPropertyOptional({
    description: 'Date d\'échéance minimale ISO 8601',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsString()
  dueDateMin?: string;

  @ApiPropertyOptional({
    description: 'Date d\'échéance maximale ISO 8601',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsString()
  dueDateMax?: string;

  @ApiPropertyOptional({
    description: 'Pagination: page (base 1)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Pagination: éléments par page',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Tri: champ',
    enum: ['createdAt', 'updatedAt', 'dueDate', 'priority', 'progress', 'title'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Tri: ordre',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}
