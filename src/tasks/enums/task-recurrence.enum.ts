/**
 * 🔄 ENUM - RÉCURRENCE DE TÂCHE
 *
 * Définit les fréquences de répétition possibles pour les tâches récurrentes
 */
export enum TaskRecurrence {
  /** Aucune récurrence - tâche unique */
  NONE = 'none',

  /** Quotidienne - se répète chaque jour */
  DAILY = 'daily',

  /** Hebdomadaire - se répète chaque semaine */
  WEEKLY = 'weekly',

  /** Mensuelle - se répète chaque mois */
  MONTHLY = 'monthly',

  /** Annuelle - se répète chaque année */
  YEARLY = 'yearly',
}
