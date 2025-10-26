import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { CreateTaskDto } from './create-task-enhanced.dto';

/**
 * 📝 DTO - MISE À JOUR DE TÂCHE
 *
 * Tous les champs du CreateTaskDto deviennent optionnels
 * Permet des mises à jour partielles
 * + champs spécifiques à la mise à jour (actualHours)
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({
    description: 'Heures réelles (uniquement en mise à jour)',
    example: 10.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actualHours?: number;

  @ApiPropertyOptional({
    description: 'UUID du parent pour déplacer la tâche',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}
