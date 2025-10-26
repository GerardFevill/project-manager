import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task-enhanced.dto';

/**
 * 📝 DTO - MISE À JOUR DE TÂCHE
 *
 * Tous les champs du CreateTaskDto deviennent optionnels
 * Permet des mises à jour partielles
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
