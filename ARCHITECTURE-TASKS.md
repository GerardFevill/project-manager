# 🏗️ Architecture du Système de Tâches Fractales

## 📋 Vue d'ensemble

Système de gestion de tâches hiérarchiques avancé avec:
- ✅ Structure fractale illimitée (arbre infini parent-enfant)
- ✅ Gestion avancée des statuts et progression
- ✅ Système de récurrence automatique
- ✅ Historique complet des actions (audit trail)
- ✅ Tags et métadonnées flexibles
- ✅ Calculs automatiques et utilitaires

---

## 🗂️ Structure des Entités

### 📦 Task Entity

```typescript
@Entity('tasks')
class Task {
  // Identité
  id: string (UUID)
  title: string (1-255 chars)
  description?: string (text)

  // Statut & Progression
  status: TaskStatus (enum)
  progress: number (0-100)
  priority: 'low' | 'medium' | 'high' | 'urgent'

  // Dates & Échéances
  dueDate?: Date
  startDate?: Date
  completedAt?: Date

  // Récurrence
  recurrence: TaskRecurrence (enum)
  nextOccurrence?: Date
  lastOccurrence?: Date

  // Structure Fractale
  level: number (0 = racine)
  parentId?: string (UUID)
  parent?: Task (ManyToOne)
  children: Task[] (OneToMany cascade)

  // Tags & Métadonnées
  tags: string[] (simple-array)
  metadata?: Record<string, any> (jsonb)
  estimatedHours?: number
  actualHours: number

  // Audit Trail
  history: TaskHistory[] (OneToMany cascade)

  // Métadonnées système
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date (soft delete)
}
```

### 📜 TaskHistory Entity

```typescript
@Entity('task_history')
class TaskHistory {
  id: string (UUID)
  taskId: string (FK)
  task: Task (ManyToOne)

  // Données d'exécution
  statusAtExecution: TaskStatus
  progressAtExecution: number
  duration?: number (secondes)
  action: string (created, updated, completed, etc.)
  metadata?: Record<string, any> (jsonb)

  // Traçabilité
  userId?: string (TODO: lier à User)
  notes?: string
  executedAt: Date
}
```

---

## 🔄 Enums

### TaskStatus
```typescript
enum TaskStatus {
  DRAFT = 'draft',       // Brouillon, non actif
  ACTIVE = 'active',     // En cours d'exécution
  COMPLETED = 'completed', // Terminée
  BLOCKED = 'blocked',   // Bloquée
  RECURRING = 'recurring', // Récurrente active
  ARCHIVED = 'archived'  // Archivée
}
```

### TaskRecurrence
```typescript
enum TaskRecurrence {
  NONE = 'none',       // Tâche unique
  DAILY = 'daily',     // Quotidienne
  WEEKLY = 'weekly',   // Hebdomadaire
  MONTHLY = 'monthly', // Mensuelle
  YEARLY = 'yearly'    // Annuelle
}
```

---

## 🎯 Fonctionnalités Principales

### 1️⃣ Structure Fractale

**Hiérarchie illimitée:**
```
Projet (level 0)
├── Phase 1 (level 1)
│   ├── Tâche A (level 2)
│   │   ├── Sous-tâche A1 (level 3)
│   │   └── Sous-tâche A2 (level 3)
│   └── Tâche B (level 2)
└── Phase 2 (level 1)
```

**Méthodes utilitaires:**
- `isRoot()` - Vérifie si c'est une tâche racine
- `calculateProgressFromChildren()` - Calcul auto de la progression
- Cascade delete: supprimer un parent supprime tous ses enfants

### 2️⃣ Gestion des Statuts

**Cycle de vie:**
```
DRAFT → ACTIVE → COMPLETED
          ↓
       BLOCKED → (déblocage) → ACTIVE
          ↓
      ARCHIVED → (restauration) → ACTIVE/COMPLETED
```

**Méthodes:**
- `toggleCompletion()` - Bascule ACTIVE ↔ COMPLETED
- `block(reason)` - Bloque avec raison (stockée dans metadata)
- `unblock()` - Débloque
- `archive()` / `unarchive()` - Archive/restaure

### 3️⃣ Récurrence

**Fréquences supportées:**
- Quotidienne (daily)
- Hebdomadaire (weekly)
- Mensuelle (monthly)
- Annuelle (yearly)

**Fonctionnement:**
```typescript
task.recurrence = TaskRecurrence.WEEKLY;
task.nextOccurrence = new Date('2025-02-01');

// Après complétion, calcule la prochaine occurrence
task.moveToNextOccurrence();
// nextOccurrence devient 2025-02-08
// status devient RECURRING
// progress reset à 0
```

**Méthode clé:**
- `moveToNextOccurrence()` - Calcule auto la prochaine date
- `isRecurring()` - Vérifie si la tâche est récurrente

### 4️⃣ Audit Trail

**TaskHistory enregistre:**
- Chaque action (created, updated, completed, archived, etc.)
- Statut et progression au moment de l'action
- Durée d'exécution
- Métadonnées custom
- Notes et commentaires
- Utilisateur (quand l'auth sera implémentée)

**Cas d'usage:**
- Traçabilité complète
- Analytics et reporting
- Historique de performance
- Conformité réglementaire

### 5️⃣ Tags & Métadonnées

**Tags (simple-array):**
```typescript
task.tags = ['urgent', 'backend', 'bug-fix', 'client-abc'];
```

**Métadonnées (JSONB):**
```typescript
task.metadata = {
  clientId: '12345',
  projectCode: 'PROJ-2025',
  externalRef: 'JIRA-456',
  customFields: { priority: 'P0' }
};
```

**Avantages:**
- Extensibilité sans migration
- Filtrage et recherche avancés
- Intégrations externes

### 6️⃣ Tracking du Temps

```typescript
task.estimatedHours = 8.5;  // Estimation
task.actualHours = 10.2;     // Temps réel

// Calcul de l'écart
const variance = task.actualHours - task.estimatedHours; // +1.7h
```

---

## 🔒 Index & Performance

**Index créés automatiquement:**
```sql
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_parent_id ON tasks(parentId);
CREATE INDEX idx_tasks_next_occurrence ON tasks(nextOccurrence);
```

**Avantages:**
- Requêtes rapides sur statut + priorité
- Navigation hiérarchique optimisée
- Traitement efficace des récurrences

---

## 📡 API REST Endpoints

### Endpoints de base

```http
GET    /tasks              # Liste avec filtres
POST   /tasks              # Créer
GET    /tasks/:id          # Détails
PATCH  /tasks/:id          # Mettre à jour
DELETE /tasks/:id          # Supprimer (cascade)
```

### Endpoints hiérarchiques

```http
GET    /tasks/:id/children   # Enfants directs
GET    /tasks/:id/tree       # Arbre complet récursif
GET    /tasks/:id/ancestors  # Parents jusqu'à la racine
```

### Endpoints actions

```http
PATCH  /tasks/:id/toggle        # Toggle ACTIVE ↔ COMPLETED
POST   /tasks/:id/block         # Bloquer avec raison
POST   /tasks/:id/unblock       # Débloquer
POST   /tasks/:id/archive       # Archiver
POST   /tasks/:id/unarchive     # Restaurer
POST   /tasks/:id/next-occurrence # Calculer prochaine occurrence
```

### Endpoints stats & analytics

```http
GET    /tasks/stats                    # Statistiques globales
GET    /tasks/:id/progress             # Progression détaillée
GET    /tasks/:id/history              # Historique complet
GET    /tasks/recurring/upcoming       # Prochaines occurrences
```

### Filtres avancés

```http
GET /tasks?status=active&priority=high&tags=urgent,backend&overdue=true
GET /tasks?recurrence=weekly&nextOccurrence[gte]=2025-01-01
GET /tasks?progress[gte]=50&progress[lt]=100
GET /tasks?search=notification&includeArchived=false
```

---

## 🧪 DTOs & Validation

### CreateTaskDto

```typescript
{
  title: string (required, 1-255 chars)
  description?: string
  status?: TaskStatus (default: DRAFT)
  progress?: number (0-100, default: 0)
  priority?: 'low' | 'medium' | 'high' | 'urgent' (default: medium)
  dueDate?: string (ISO 8601)
  startDate?: string (ISO 8601)
  recurrence?: TaskRecurrence (default: NONE)
  nextOccurrence?: string (ISO 8601)
  parentId?: string (UUID)
  tags?: string[] (max 20)
  estimatedHours?: number (>= 0)
  metadata?: Record<string, any>
}
```

### UpdateTaskDto

Extends `PartialType(CreateTaskDto)` - tous les champs optionnels

### TaskFilterDto

```typescript
{
  status?: TaskStatus | 'all'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  recurrence?: TaskRecurrence
  onlyRoot?: boolean
  onlyOverdue?: boolean
  parentId?: string (UUID)
  tags?: string[]
  search?: string (titre + description)
  includeArchived?: boolean
  progress?: { gte?: number, lt?: number }
  dueDate?: { gte?: string, lt?: string }
}
```

---

## 🔧 Méthodes Utilitaires (Entity)

```typescript
// Vérifications
task.isOverdue(): boolean        // Échéance passée et non complété
task.isRoot(): boolean           // Tâche racine (level 0)
task.isRecurring(): boolean      // A une récurrence

// Actions
task.toggleCompletion(): void    // ACTIVE ↔ COMPLETED
task.moveToNextOccurrence(): void // Calcule prochaine date
task.calculateProgressFromChildren(children): void // Recalcul auto

// Gestion du statut
task.block(reason?: string): void    // Bloquer
task.unblock(): void                 // Débloquer
task.archive(): void                 // Archiver
task.unarchive(): void               // Restaurer
```

---

## 🗄️ Schéma Base de Données

### Table `tasks`

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,

  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',

  due_date TIMESTAMP,
  start_date TIMESTAMP,
  completed_at TIMESTAMP,

  recurrence VARCHAR(20) NOT NULL DEFAULT 'none',
  next_occurrence TIMESTAMP,
  last_occurrence TIMESTAMP,

  level INTEGER NOT NULL DEFAULT 0,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,

  tags TEXT[],
  metadata JSONB,
  estimated_hours NUMERIC(10,2),
  actual_hours NUMERIC(10,2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Index
  CONSTRAINT chk_level_nonnegative CHECK (level >= 0),
  CONSTRAINT chk_progress_range CHECK (progress BETWEEN 0 AND 100)
);

-- Index pour performance
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);
CREATE INDEX idx_tasks_next_occurrence ON tasks(next_occurrence) WHERE next_occurrence IS NOT NULL;
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);
CREATE INDEX idx_tasks_metadata ON tasks USING GIN(metadata);
```

### Table `task_history`

```sql
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,

  status_at_execution VARCHAR(20) NOT NULL,
  progress_at_execution INTEGER NOT NULL,
  duration INTEGER,
  action VARCHAR(50) NOT NULL,
  metadata JSONB,

  user_id UUID,
  notes TEXT,
  executed_at TIMESTAMP DEFAULT NOW(),

  -- Index
  CREATE INDEX idx_task_history_task_id ON task_history(task_id);
  CREATE INDEX idx_task_history_executed_at ON task_history(executed_at);
);
```

---

## 🚀 Évolutions Futures

### 1️⃣ Authentification & Ownership
```typescript
@ManyToOne(() => User)
assignedTo: User;

@ManyToOne(() => User)
createdBy: User;

@ManyToMany(() => User)
watchers: User[];
```

### 2️⃣ Notifications
```typescript
@Column({ default: false })
notifyOnCompletion: boolean;

@Column({ default: false })
notifyOnOverdue: boolean;
```

### 3️⃣ Dépendances entre tâches
```typescript
@ManyToMany(() => Task)
@JoinTable()
blockedBy: Task[]; // Dépendances

@ManyToMany(() => Task)
blocks: Task[]; // Bloque ces tâches
```

### 4️⃣ Templates de tâches
```typescript
@Column({ default: false })
isTemplate: boolean;

@ManyToOne(() => Task)
createdFromTemplate: Task;
```

### 5️⃣ Workflow & Automatisation
```typescript
@Column({ type: 'jsonb' })
automationRules: {
  onComplete: Action[],
  onOverdue: Action[],
  onProgress: { threshold: number, action: Action }[]
}
```

### 6️⃣ Attachments & Files
```typescript
@OneToMany(() => TaskAttachment)
attachments: TaskAttachment[];
```

### 7️⃣ Comments & Discussion
```typescript
@OneToMany(() => TaskComment)
comments: TaskComment[];
```

---

## 📊 Métriques & Analytics

### Statistiques disponibles

```typescript
{
  total: number,              // Total de tâches
  byStatus: {                 // Répartition par statut
    draft: number,
    active: number,
    completed: number,
    blocked: number,
    recurring: number,
    archived: number
  },
  byPriority: {               // Répartition par priorité
    low: number,
    medium: number,
    high: number,
    urgent: number
  },
  overdue: number,            // Tâches en retard
  completionRate: number,     // Taux de complétion %
  avgProgress: number,        // Progression moyenne
  avgCompletionTime: number,  // Temps moyen de complétion (heures)
  upcomingRecurrences: {      // Prochaines récurrences (7 jours)
    count: number,
    tasks: Task[]
  }
}
```

---

## 📚 Documentation API (Swagger)

Accessible sur: `http://localhost:3000/api`

- Documentation interactive complète
- Try it out pour tester les endpoints
- Schémas de validation affichés
- Exemples de requêtes/réponses

---

## ✅ Checklist d'implémentation

### Backend
- [x] Créer enums (TaskStatus, TaskRecurrence)
- [x] Créer entité Task améliorée
- [x] Créer entité TaskHistory
- [ ] Créer DTOs avec validation complète
- [ ] Mettre à jour TaskService avec nouvelles fonctionnalités
- [ ] Créer endpoints API REST
- [ ] Créer migrations Liquibase
- [ ] Tests unitaires (services)
- [ ] Tests e2e (endpoints)

### Frontend
- [ ] Mettre à jour models TypeScript
- [ ] Mettre à jour TaskService Angular
- [ ] Créer composants pour nouveaux statuts
- [ ] Interface pour récurrence
- [ ] Interface pour tags
- [ ] Visualisation de l'historique
- [ ] Gestion du temps (estimated/actual)
- [ ] Tests frontend

### Base de données
- [ ] Migration: ajouter nouvelles colonnes
- [ ] Migration: créer table task_history
- [ ] Migration: créer index
- [ ] Seeds de données pour tests

---

**Dernière mise à jour:** 2025-10-26
**Version:** 2.0.0
**Auteur:** Architecture définie avec Claude Code
