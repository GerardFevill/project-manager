# Tests pour le Module Workflows

Ce dossier contient tous les tests pour le module Workflows.

## Structure des Tests

### Tests Unitaires (`workflows.service.spec.ts`)

Tests unitaires complets pour `WorkflowsService` avec mocks de toutes les dépendances.

**Couverture:**
- ✅ CRUD de base (findAll, findOne, create, update, remove)
- ✅ Transitions (getWorkflowTransitions, updateWorkflowTransition)
- ✅ Publishing & Draft (publishWorkflow, getDraftWorkflow, createDraftWorkflow)
- ✅ Propriétés (updateWorkflowProperties)
- ✅ Workflow Schemes (getWorkflowSchemesForProjects)
- ✅ Transition Rules (addTransitionRules)
- ✅ Validation (validateWorkflow)
- ✅ Recherche (searchWorkflows)

**Nombre de tests:** 45+ scénarios

**Cas testés:**
- Scénarios de succès pour toutes les opérations
- Gestion d'erreurs (NotFoundException pour workflows inexistants)
- Cycle draft → published
- Création de draft depuis published
- Détection draft existant
- Validation avec erreurs et avertissements
- Recherche par nom ou description
- Workflow schemes pour projets multiples
- Transition rules avec types (conditions, validators, postFunctions, permissions)
- Timestamps (updatedAt, publishedAt, validatedAt, createdAt)

### Tests d'Intégration (`workflows.integration.spec.ts`)

Tests d'intégration avec une vraie base de données (SQLite en mémoire).

**Note:** Ces tests sont actuellement des squelettes et peuvent être étendus selon les besoins.

**Scénarios prévus:**
- Cycle de vie complet (Create → Update → Publish)
- Draft vers Published workflow
- Création de draft depuis published
- Recherche avec vraies données
- Validation avec vraie base de données
- Gestion des transitions
- Propriétés de workflow
- Schemes pour projets

## Exécuter les Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests spécifiques au module Workflows
npm test -- workflows.service.spec

# Tests d'intégration uniquement
npm test -- workflows.integration.spec
```

## Couverture de Code

Objectif: **>80%** de couverture pour le service Workflows

Pour vérifier la couverture:
```bash
npm run test:cov
```

Le rapport sera généré dans `coverage/lcov-report/index.html`

## Détails des Tests

### CRUD de Base (11 tests)

**findAll:**
- ✅ Retourne tous les workflows triés par createdAt DESC
- ✅ Retourne un tableau vide si aucun workflow

**findOne:**
- ✅ Retourne un workflow par ID
- ✅ Lance NotFoundException si non trouvé

**create:**
- ✅ Crée un nouveau workflow avec valeurs par défaut
- ✅ Définit isDraft=true par défaut pour nouveaux workflows
- ✅ Définit isActive=true par défaut

**update:**
- ✅ Met à jour un workflow avec succès
- ✅ Lance NotFoundException si workflow non trouvé

**remove:**
- ✅ Supprime un workflow avec succès
- ✅ Lance NotFoundException si workflow non trouvé

### Transitions (4 tests)

**getWorkflowTransitions:**
- ✅ Retourne la structure des transitions (workflowId, workflowName, transitions[])
- ✅ Lance NotFoundException si workflow non trouvé

**updateWorkflowTransition:**
- ✅ Met à jour une transition avec data et timestamp
- ✅ Lance NotFoundException si workflow non trouvé

**Structure d'une transition:**
```typescript
{
  id: 'trans1',
  name: 'Start Progress',
  fromStatus: { id: 'open', name: 'Open' },
  toStatus: { id: 'in-progress', name: 'In Progress' },
  screen: null,
  properties: {
    conditions: [],
    validators: [],
    postFunctions: []
  }
}
```

### Publishing & Draft (8 tests)

**publishWorkflow:**
- ✅ Publie un workflow draft (isDraft=false, isActive=true)
- ✅ Lance NotFoundException si workflow non trouvé
- ✅ Définit isActive=true lors de la publication

**getDraftWorkflow:**
- ✅ Retourne le draft si isDraft=true
- ✅ Retourne le published si isDraft=false
- ✅ Lance NotFoundException si workflow non trouvé

**createDraftWorkflow:**
- ✅ Crée un draft depuis un workflow publié
- ✅ Retourne le workflow existant si déjà en draft
- ✅ Lance NotFoundException si workflow non trouvé

**Cycle de vie draft/published:**
1. Création: `isDraft=true, isActive=true` (nouveau workflow en mode brouillon)
2. Publication: `isDraft=false, isActive=true` (workflow actif)
3. Création draft: Copie du published avec `isDraft=true, parentWorkflowId=originalId`

### Propriétés (2 tests)

**updateWorkflowProperties:**
- ✅ Met à jour les propriétés avec timestamp
- ✅ Lance NotFoundException si workflow non trouvé

**Propriétés possibles:**
```typescript
{
  allowedRoles: ['admin', 'developer'],
  allowedGroups: ['developers', 'admins'],
  options: { autoTransition: true },
  metadata: { customField: 'value' }
}
```

### Workflow Schemes (4 tests)

**getWorkflowSchemesForProjects:**
- ✅ Retourne les schemes pour plusieurs projets (CSV)
- ✅ Gère les project IDs vides
- ✅ Nettoie les espaces dans les IDs
- ✅ Filtre les IDs vides

**Structure d'un scheme:**
```typescript
{
  projectId: 'proj1',
  schemeId: 'scheme1',
  schemeName: 'Default Workflow Scheme',
  mappings: [
    {
      issueType: 'Bug',
      issueTypeId: 'bug',
      workflowId: 'workflow1',
      workflowName: 'Bug Workflow'
    },
    {
      issueType: 'Task',
      issueTypeId: 'task',
      workflowId: 'workflow2',
      workflowName: 'Task Workflow'
    }
  ]
}
```

### Transition Rules (3 tests)

**addTransitionRules:**
- ✅ Ajoute des rules avec structure ruleTypes
- ✅ Gère les tableaux de rules vides
- ✅ Gère les rules partielles

**Types de règles:**
- **Conditions**: Vérifications avant transition (ex: user_is_assignee, status_is_open)
- **Validators**: Validations des données (ex: required_field_validator, email_validator)
- **Post-functions**: Actions après transition (ex: assign_to_current_user, send_notification)
- **Permissions**: Qui peut effectuer la transition (ex: edit_issues, admin_only)

**Exemple complet:**
```typescript
{
  conditions: ['user_is_assignee', 'status_is_open'],
  validators: ['required_field_validator'],
  postFunctions: ['assign_to_current_user', 'send_notification'],
  permissions: ['edit_issues']
}
```

### Validation (8 tests)

**validateWorkflow:**
- ✅ Valide un workflow correct sans erreurs
- ✅ Détecte le nom de workflow manquant
- ✅ Détecte le nom trop long (> 255 caractères)
- ✅ Avertit si workflow en draft
- ✅ Avertit si workflow inactif
- ✅ Gère plusieurs erreurs et avertissements simultanément
- ✅ Retourne timestamp validatedAt
- ✅ Lance NotFoundException si workflow non trouvé

**Règles de validation:**
- **Erreurs** (errors): Invalident le workflow
  - Nom requis et non vide
  - Nom max 255 caractères

- **Avertissements** (warnings): N'invalident pas le workflow
  - Workflow en mode draft
  - Workflow inactif

**Validations avancées (TODO):**
- Au moins 2 statuts
- Au moins 1 transition
- Aucun statut isolé (doit être accessible et pouvoir sortir)
- Vérification des cycles de transitions
- Vérification des règles de transition

### Recherche (3 tests)

**searchWorkflows:**
- ✅ Recherche par nom ou description
- ✅ Limite les résultats à 20 workflows
- ✅ Retourne un tableau vide si aucun match

## Ajouter de Nouveaux Tests

### Template pour test unitaire:

```typescript
describe('methodName', () => {
  it('should do something successfully', async () => {
    // Arrange
    mockRepository.method.mockResolvedValue(mockData);

    // Act
    const result = await service.methodName(params);

    // Assert
    expect(result).toEqual(expected);
    expect(mockRepository.method).toHaveBeenCalledWith(expectedParams);
  });

  it('should throw error when...', async () => {
    // Arrange
    mockRepository.method.mockResolvedValue(null);

    // Act & Assert
    await expect(service.methodName(params)).rejects.toThrow(ExpectedError);
  });
});
```

## Conventions

- **Arrange-Act-Assert**: Structure claire des tests
- **Descriptive names**: Noms de tests explicites décrivant le comportement
- **One assertion focus**: Chaque test se concentre sur un aspect
- **Mock cleanup**: Utilisation de `afterEach(() => jest.clearAllMocks())`
- **Test data**: Données de test réutilisables définies en début de fichier

## Debugging

Pour débugger un test spécifique:

```bash
# Avec Node inspector
npm run test:debug -- workflows.service.spec

# Puis dans Chrome: chrome://inspect
```

## CI/CD

Les tests sont automatiquement exécutés dans la CI lors de:
- Pull requests
- Commits sur la branche principale
- Déploiements

Les builds échouent si:
- Un test échoue
- La couverture descend en dessous de 80%

## Notes Techniques

### Mocking TypeORM Query Builder

Pour les tests de recherche:

```typescript
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(mockWorkflows),
};

mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
```

### Gestion des Timestamps

Les tests vérifient que les timestamps sont correctement mis à jour:

```typescript
expect(mockRepository.save).toHaveBeenCalledWith(
  expect.objectContaining({
    updatedAt: expect.any(Date),
  })
);

expect(result.publishedAt).toBeInstanceOf(Date);
```

### Test du Cycle Draft/Published

```typescript
// 1. Créer en draft
const workflow = await service.create({ name: 'Test' });
expect(workflow.isDraft).toBe(true);

// 2. Publier
const published = await service.publishWorkflow(workflow.id);
expect(published.isDraft).toBe(false);
expect(published.isActive).toBe(true);

// 3. Créer nouveau draft
const draft = await service.createDraftWorkflow(workflow.id);
expect(draft.draft.parentWorkflowId).toBe(workflow.id);
```

## Concepts Jira Workflows

### Qu'est-ce qu'un Workflow?

Un workflow définit le cycle de vie d'une issue dans Jira:
- **Statuts**: États possibles (Open, In Progress, Done)
- **Transitions**: Passages entre statuts (Open → In Progress)
- **Règles**: Conditions, validations, actions

### Draft vs Published

- **Draft**: Version en cours d'édition, non utilisée par les projets
- **Published**: Version active utilisée par les projets

### Workflow Schemes

Association entre types d'issues et workflows par projet:
- Bug → Bug Workflow
- Task → Task Workflow
- Story → Story Workflow

### Transition Rules

Contrôle fin des transitions:
- **Conditions**: Qui peut effectuer la transition (rôles, statuts)
- **Validators**: Vérifications des champs (requis, formats)
- **Post-functions**: Actions automatiques après transition
