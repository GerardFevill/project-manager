/**
 * 📊 ENUM - STATUT DE TÂCHE
 *
 * Définit tous les états possibles d'une tâche dans le cycle de vie
 */
export enum TaskStatus {
  /** Brouillon - tâche en préparation, non encore active */
  DRAFT = 'draft',

  /** Active - tâche en cours d'exécution */
  ACTIVE = 'active',

  /** Complétée - tâche terminée avec succès */
  COMPLETED = 'completed',

  /** Bloquée - tâche stoppée en attente de résolution */
  BLOCKED = 'blocked',

  /** Récurrente - tâche qui se répète automatiquement */
  RECURRING = 'recurring',

  /** Archivée - tâche retirée de la circulation active */
  ARCHIVED = 'archived',
}
