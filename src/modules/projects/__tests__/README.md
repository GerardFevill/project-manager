# Tests pour le Module Projects

Ce dossier contient tous les tests pour le module Projects.

## Structure des Tests

### Tests Unitaires (`projects.service.spec.ts`)

Tests unitaires complets pour `ProjectsService` avec mocks de toutes les dépendances.

**Couverture:**
- ✅ CRUD de base (findAll, findOne, findByKey, create, update, remove)
- ✅ Opérations d'archivage (archive, unarchive)
- ✅ Gestion des utilisateurs et rôles (getProjectUsers, getRoleActors, addRoleActor, removeRoleActor)
- ✅ Configuration du projet (getIssueSecurityLevelScheme, getNotificationScheme, getPermissionScheme, getProjectFeatures, updateProjectFeatures)
- ✅ Recherche et métadonnées (searchProjects, getProjectAvatar, uploadProjectAvatar, getProjectHierarchy, getProjectInsights)
- ✅ Validation (validateProject)

**Nombre de tests:** 50+ scénarios

**Cas testés:**
- Scénarios de succès pour toutes les opérations CRUD
- Gestion d'erreurs (NotFoundException pour projets inexistants)
- ConflictException pour clés de projet dupliquées
- Validation de clés de projet (format, unicité)
- Comportements de pagination (calcul de lastPage)
- Mise à jour de timestamps (updatedAt)
- Validation complète avec erreurs et avertissements multiples
- Formats valides de clés de projet (A, AB, ABC123, etc.)
- Recherche multi-critères (nom, clé, description)

### Tests d'Intégration (`projects.integration.spec.ts`)

Tests d'intégration avec une vraie base de données (SQLite en mémoire).

**Note:** Ces tests sont actuellement des squelettes et peuvent être étendus selon les besoins.

**Scénarios prévus:**
- Cycle de vie complet du projet (Create → Update → Archive → Unarchive → Delete)
- Prévention de clés dupliquées lors de la création
- Mise à jour de clés avec vérification d'unicité
- Recherche de projets avec vraies données
- Validation avec vraie base de données
- Pagination avec 25 projets réels

## Exécuter les Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests spécifiques au module Projects
npm test -- projects.service.spec

# Tests d'intégration uniquement
npm test -- projects.integration.spec
```

## Couverture de Code

Objectif: **>80%** de couverture pour le service Projects

Pour vérifier la couverture:
```bash
npm run test:cov
```

Le rapport sera généré dans `coverage/lcov-report/index.html`

## Détails des Tests

### CRUD de Base

**findAll:**
- ✅ Retourne des projets paginés avec relations
- ✅ Gère les paramètres de pagination par défaut
- ✅ Calcule lastPage correctement

**findOne:**
- ✅ Retourne un projet par ID avec relations
- ✅ Lance NotFoundException si non trouvé

**findByKey:**
- ✅ Retourne un projet par clé avec relations
- ✅ Lance NotFoundException si clé non trouvée

**create:**
- ✅ Crée un nouveau projet avec succès
- ✅ Lance ConflictException si la clé existe déjà
- ✅ Définit isArchived à false par défaut

**update:**
- ✅ Met à jour un projet avec succès
- ✅ Lance NotFoundException si projet non trouvé
- ✅ Permet de changer la clé si unique
- ✅ Lance ConflictException si nouvelle clé existe déjà
- ✅ Ne vérifie pas les doublons si la clé n'est pas modifiée

**remove:**
- ✅ Supprime un projet avec succès
- ✅ Lance NotFoundException si projet non trouvé

### Archivage

**archive:**
- ✅ Archive un projet avec succès
- ✅ Met à jour le champ isArchived et updatedAt
- ✅ Lance NotFoundException si projet non trouvé

**unarchive:**
- ✅ Désarchive un projet avec succès
- ✅ Met à jour le champ isArchived et updatedAt
- ✅ Lance NotFoundException si projet non trouvé

### Utilisateurs & Rôles

**getProjectUsers:**
- ✅ Retourne la structure des utilisateurs du projet
- ✅ Lance NotFoundException si projet non trouvé

**getRoleActors:**
- ✅ Retourne la structure des acteurs du rôle
- ✅ Lance NotFoundException si projet non trouvé

**addRoleActor:**
- ✅ Ajoute un acteur à un rôle avec succès
- ✅ Retourne l'acteur avec timestamp addedAt
- ✅ Lance NotFoundException si projet non trouvé

**removeRoleActor:**
- ✅ Vérifie que le projet existe lors de la suppression
- ✅ Lance NotFoundException si projet non trouvé

### Configuration

Tous les tests de configuration vérifient:
- ✅ Retour de la structure correcte
- ✅ NotFoundException si projet non trouvé

**getIssueSecurityLevelScheme:** Schéma de sécurité des issues
**getNotificationScheme:** Schéma de notifications
**getPermissionScheme:** Schéma de permissions
**getProjectFeatures:** Fonctionnalités Jira (boards, sprints, reports, etc.)
**updateProjectFeatures:** Mise à jour des fonctionnalités

### Recherche & Métadonnées

**searchProjects:**
- ✅ Recherche par nom, clé ou description
- ✅ Utilise le query builder TypeORM
- ✅ Limite les résultats à 20 projets

**getProjectAvatar:**
- ✅ Retourne la structure de l'avatar
- ✅ Lance NotFoundException si projet non trouvé

**uploadProjectAvatar:**
- ✅ Upload un avatar avec succès
- ✅ Retourne URL et timestamp
- ✅ Lance NotFoundException si projet non trouvé

**getProjectHierarchy:**
- ✅ Retourne la hiérarchie Epic/Story/Task/Sub-task
- ✅ Lance NotFoundException si projet non trouvé

**getProjectInsights:**
- ✅ Retourne les statistiques du projet
- ✅ Inclut timestamp calculatedAt
- ✅ Lance NotFoundException si projet non trouvé

### Validation

**validateProject:**
- ✅ Valide un projet correct sans erreurs
- ✅ Détecte le nom de projet manquant
- ✅ Détecte la clé de projet manquante
- ✅ Détecte le format de clé invalide (doit être ^[A-Z][A-Z0-9]*$)
- ✅ Avertit si le projet n'a pas de lead
- ✅ Avertit si le projet est archivé
- ✅ Accepte les formats de clé valides (A, AB, ABC, ABC123, etc.)
- ✅ Détecte plusieurs erreurs et avertissements simultanément
- ✅ Lance NotFoundException si projet non trouvé

**Règles de validation:**
- **Erreurs** (errors): Invalident le projet
  - Nom requis et non vide
  - Clé requise et non vide
  - Clé doit correspondre au format: commence par une lettre, contient uniquement lettres majuscules et chiffres

- **Avertissements** (warnings): N'invalident pas le projet
  - Projet sans lead
  - Projet archivé

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
- **Complete mocks**: Tous les mocks retournent `this` pour le chaînage

## Debugging

Pour débugger un test spécifique:

```bash
# Avec Node inspector
npm run test:debug -- projects.service.spec

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

Pour les tests de recherche, nous mockons le query builder:

```typescript
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(mockProjects),
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
```

### Test de Validation Multiple

Le test de validation peut détecter plusieurs erreurs et avertissements:

```typescript
const invalidProject = {
  name: '',           // Erreur: nom requis
  projectKey: 'inv',  // Erreur: format invalide
  leadId: null,       // Avertissement: pas de lead
  isArchived: true,   // Avertissement: archivé
};
```
