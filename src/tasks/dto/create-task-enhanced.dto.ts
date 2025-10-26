import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
  IsUUID,
  IsDateString,
  IsNumber,
  IsObject,
  Length,
  ArrayMaxSize,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../enums/task-status.enum';
import { TaskRecurrence } from '../enums/task-recurrence.enum';

/**
 * 📝 DTO - CRÉATION DE TÂCHE COMPLÈTE
 *
 * Validation robuste avec class-validator
 * Documentation Swagger intégrée
 */
export class CreateTaskDto {
  // === CHAMPS OBLIGATOIRES ===

  @ApiProperty({
    description: 'Titre de la tâche',
    example: 'Implémenter le système de notifications',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255, { message: 'Le titre doit contenir entre 1 et 255 caractères' })
  title: string;

  // === CHAMPS OPTIONNELS ===

  @ApiPropertyOptional({
    description: 'Description détaillée',
    example: 'Créer un système de notifications temps réel avec WebSocket',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Statut initial',
    enum: TaskStatus,
    default: TaskStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Progression 0-100%',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    description: 'Priorité',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @ApiPropertyOptional({
    description: 'Date d\'échéance ISO 8601',
    example: '2025-12-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Date de début ISO 8601',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Type de récurrence',
    enum: TaskRecurrence,
    default: TaskRecurrence.NONE,
  })
  @IsOptional()
  @IsEnum(TaskRecurrence)
  recurrence?: TaskRecurrence;

  @ApiPropertyOptional({
    description: 'Prochaine occurrence (requis si recurrence != none)',
    example: '2025-02-01T00:00:00Z',
  })
  @ValidateIf((o) => o.recurrence && o.recurrence !== TaskRecurrence.NONE)
  @IsDateString()
  nextOccurrence?: string;

  @ApiPropertyOptional({
    description: 'UUID du parent pour sous-tâche',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Tags (max 20)',
    example: ['urgent', 'backend', 'api'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Estimation en heures',
    example: 8.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedHours?: number;

  @ApiPropertyOptional({
    description: 'Métadonnées JSON',
    example: { clientId: '123', projectCode: 'PROJ-2025' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
