# Tests pour le Module Issues

Ce dossier contient tous les tests pour le module Issues.

## Structure des Tests

### Tests Unitaires (`issues.service.spec.ts`)

Tests unitaires complets pour `IssuesService` avec mocks de toutes les dépendances.

**Couverture:**
- ✅ CRUD de base (findOne, findByKey, create, update, remove)
- ✅ Opérations en masse (createBulk, updateBulk)
- ✅ Actions sur issues (assign, move, clone, archive, restore)
- ✅ Gestion des sous-tâches (getSubtasks, createSubtask)
- ✅ Gestion des liens distants (getRemoteLinks, addRemoteLink, removeRemoteLink)
- ✅ Métadonnées (getEditMeta, getCreateMeta, getPickerSuggestions)

**Nombre de tests:** 30+ scénarios

**Cas testés:**
- Scénarios de succès
- Gestion d'erreurs (NotFoundException, BadRequestException)
- Validation des données
- Comportements edge cases

### Tests d'Intégration (`issues.integration.spec.ts`)

Tests d'intégration avec une vraie base de données (SQLite en mémoire).

**Note:** Ces tests sont actuellement des squelettes et peuvent être étendus selon les besoins.

## Exécuter les Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests spécifiques au module Issues
npm test -- issues.service.spec

# Tests d'intégration uniquement
npm test -- issues.integration.spec
```

## Couverture de Code

Objectif: **>80%** de couverture pour le service Issues

Pour vérifier la couverture:
```bash
npm run test:cov
```

Le rapport sera généré dans `coverage/lcov-report/index.html`

## Ajouter de Nouveaux Tests

### Template pour test unitaire:

```typescript
describe('methodName', () => {
  it('should do something successfully', async () => {
    // Arrange
    jest.spyOn(repository, 'method').mockResolvedValue(mockData);

    // Act
    const result = await service.methodName(params);

    // Assert
    expect(result).toEqual(expected);
    expect(repository.method).toHaveBeenCalledWith(expectedParams);
  });

  it('should throw error when...', async () => {
    // Arrange
    jest.spyOn(repository, 'method').mockRejectedValue(new Error());

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
npm run test:debug -- issues.service.spec

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
