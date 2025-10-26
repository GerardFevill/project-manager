import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 🔧 DTO - ACTIONS SUR TÂCHES
 */

/**
 * Bloquer une tâche avec raison
 */
export class BlockTaskDto {
  @ApiPropertyOptional({
    description: 'Raison du blocage',
    example: 'En attente de validation client',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

/**
 * Ajouter une note à l'historique
 */
export class AddTaskNoteDto {
  @ApiPropertyOptional({
    description: 'Note ou commentaire',
    example: 'Tâche reportée à demain suite à réunion',
  })
  @IsString()
  note: string;
}
