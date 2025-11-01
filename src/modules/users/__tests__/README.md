# Tests pour le Module Users

Ce dossier contient tous les tests pour le module Users.

## Structure des Tests

### Tests Unitaires (`users.service.spec.ts`)

Tests unitaires complets pour `UsersService` avec mocks de toutes les dépendances (repository, bcrypt).

**Couverture:**
- ✅ CRUD de base (findAll, findOne, findByUsername, findByEmail, create, update, remove)
- ✅ Recherche & queries (searchWithQuery, searchAssignableMultiProject, userPicker)
- ✅ Relations (getUserGroups, getUserPermissions)
- ✅ Propriétés utilisateur (getUserProperties, setUserProperty, deleteUserProperty)
- ✅ Avatar (getUserAvatar, uploadUserAvatar)
- ✅ Opérations en masse (getBulkUsers, getUserMigrationData, getUserByEmail)
- ✅ Validation & sécurité (validatePassword, calculatePasswordStrength, verifyCredentials)

**Nombre de tests:** 60+ scénarios

**Cas testés:**
- Scénarios de succès pour toutes les opérations
- Gestion d'erreurs (NotFoundException pour utilisateurs inexistants)
- ConflictException pour username/email dupliqués
- Hashing de password avec bcrypt (10 rounds)
- Validation de password (longueur, complexité, force)
- Vérification de credentials (authentification)
- Recherche multi-champs
- Formatage displayName
- Pagination et calcul de lastPage
- Filtrage par isActive
- Bulk operations avec parsing CSV
- Timestamps (updatedAt, uploadedAt)

### Tests d'Intégration (`users.integration.spec.ts`)

Tests d'intégration avec une vraie base de données (SQLite en mémoire).

**Note:** Ces tests sont actuellement des squelettes et peuvent être étendus selon les besoins.

**Scénarios prévus:**
- Cycle de vie complet d'un utilisateur
- Prévention de doublons (username, email)
- Hashing de password en base de données
- Vérification de credentials avec vraie DB
- Recherche avec vraies données
- Pagination avec 25 utilisateurs réels
- Validation de password en contexte réel
- Opérations en masse

## Exécuter les Tests

```bash
# Tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:cov

# Tests spécifiques au module Users
npm test -- users.service.spec

# Tests d'intégration uniquement
npm test -- users.integration.spec
```

## Couverture de Code

Objectif: **>80%** de couverture pour le service Users

Pour vérifier la couverture:
```bash
npm run test:cov
```

Le rapport sera généré dans `coverage/lcov-report/index.html`

## Détails des Tests

### CRUD de Base (17 tests)

**findAll:**
- ✅ Retourne des utilisateurs paginés avec groups relations
- ✅ Gère les paramètres de pagination par défaut
- ✅ Calcule lastPage correctement

**findOne:**
- ✅ Retourne un utilisateur par ID avec relations
- ✅ Lance NotFoundException si non trouvé

**findByUsername:**
- ✅ Retourne un utilisateur par username avec relations
- ✅ Retourne null si username non trouvé

**findByEmail:**
- ✅ Retourne un utilisateur par email avec relations
- ✅ Retourne null si email non trouvé

**create:**
- ✅ Crée un nouvel utilisateur avec password hashé (bcrypt 10 rounds)
- ✅ Lance ConflictException si username existe déjà
- ✅ Lance ConflictException si email existe déjà
- ✅ Définit isActive à true par défaut

**update:**
- ✅ Met à jour un utilisateur avec succès
- ✅ Lance NotFoundException si utilisateur non trouvé
- ✅ Vérifie l'unicité de l'email si modifié
- ✅ Lance ConflictException si nouvel email existe déjà
- ✅ Hash le password si modifié

**remove:**
- ✅ Supprime un utilisateur avec succès
- ✅ Lance NotFoundException si utilisateur non trouvé

### Recherche & Queries (7 tests)

**searchWithQuery:**
- ✅ Recherche par username, email, firstName, lastName
- ✅ Utilise le query builder TypeORM avec orWhere
- ✅ Limite les résultats à 20 utilisateurs

**searchAssignableMultiProject:**
- ✅ Retourne les utilisateurs actifs pour plusieurs projets
- ✅ Formate displayName correctement
- ✅ Gère les project IDs vides

**userPicker:**
- ✅ Retourne des suggestions pour utilisateurs actifs
- ✅ Limite les résultats à 10 suggestions
- ✅ Format optimisé pour composants UI

### Relations (4 tests)

**getUserGroups:**
- ✅ Retourne les groupes de l'utilisateur
- ✅ Lance NotFoundException si utilisateur non trouvé

**getUserPermissions:**
- ✅ Retourne les permissions de l'utilisateur
- ✅ Lance NotFoundException si utilisateur non trouvé

### Propriétés Utilisateur (6 tests)

**getUserProperties:**
- ✅ Retourne la structure des propriétés
- ✅ Lance NotFoundException si utilisateur non trouvé

**setUserProperty:**
- ✅ Définit une propriété avec timestamp
- ✅ Lance NotFoundException si utilisateur non trouvé

**deleteUserProperty:**
- ✅ Vérifie que l'utilisateur existe lors de la suppression
- ✅ Lance NotFoundException si utilisateur non trouvé

### Avatar (4 tests)

**getUserAvatar:**
- ✅ Retourne la structure de l'avatar avec type
- ✅ Lance NotFoundException si utilisateur non trouvé

**uploadUserAvatar:**
- ✅ Upload un avatar avec timestamp
- ✅ Lance NotFoundException si utilisateur non trouvé

### Opérations en Masse (6 tests)

**getBulkUsers:**
- ✅ Récupère plusieurs utilisateurs par IDs CSV
- ✅ Gère une liste d'IDs vide
- ✅ Nettoie les espaces dans les IDs
- ✅ Formate displayName pour chaque utilisateur

**getUserMigrationData:**
- ✅ Récupère les données complètes pour migration
- ✅ Inclut createdAt, updatedAt, groups

**getUserByEmail:**
- ✅ Retourne un utilisateur par email avec displayName
- ✅ Lance NotFoundException si email non trouvé

### Validation & Sécurité (10 tests)

**validatePassword:**
- ✅ Valide un password fort avec succès
- ✅ Détecte password trop court (< 8 caractères)
- ✅ Avertit si majuscule manquante
- ✅ Avertit si minuscule manquante
- ✅ Avertit si chiffre manquant
- ✅ Avertit si caractère spécial manquant
- ✅ Détecte si password identique au précédent (avec userId)
- ✅ Calcule la force du password correctement (0-4)
- ✅ Gère plusieurs erreurs et avertissements

**verifyCredentials:**
- ✅ Retourne l'utilisateur si credentials valides
- ✅ Retourne null si username non trouvé
- ✅ Retourne null si password invalide

**Règles de validation du password:**
- **Erreurs** (errors): Invalident le password
  - Longueur minimum 8 caractères
  - Doit être différent du password actuel

- **Avertissements** (warnings): N'invalident pas le password
  - Devrait contenir au moins une majuscule
  - Devrait contenir au moins une minuscule
  - Devrait contenir au moins un chiffre
  - Devrait contenir au moins un caractère spécial

- **Force du password** (strength: 0-4):
  - 0: Très faible
  - 1: Faible
  - 2: Moyen
  - 3: Fort
  - 4: Très fort

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

### Template pour test de sécurité avec bcrypt:

```typescript
it('should hash password correctly', async () => {
  // Arrange
  const plainPassword = 'Password123!';
  const hashedPassword = '$2b$10$hashedPassword';
  jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
  mockRepository.save.mockResolvedValue({ ...mockUser, password: hashedPassword });

  // Act
  await service.create({ ...createDto, password: plainPassword });

  // Assert
  expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
});
```

## Conventions

- **Arrange-Act-Assert**: Structure claire des tests
- **Descriptive names**: Noms de tests explicites décrivant le comportement
- **One assertion focus**: Chaque test se concentre sur un aspect
- **Mock cleanup**: Utilisation de `afterEach(() => jest.clearAllMocks())`
- **Test data**: Données de test réutilisables définies en début de fichier
- **Bcrypt mocking**: Mock de bcrypt pour les tests de password
- **Security focus**: Tests spécifiques pour la sécurité (password, credentials)

## Debugging

Pour débugger un test spécifique:

```bash
# Avec Node inspector
npm run test:debug -- users.service.spec

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

### Mocking bcrypt

Pour les tests de password, nous mockons bcrypt:

```typescript
jest.mock('bcrypt');

// Dans les tests
jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
```

### Mocking TypeORM Query Builder

Pour les tests de recherche:

```typescript
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(mockUsers),
};

mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
```

### Tests de Validation de Password

Les tests de validation couvrent:
- Longueur minimum (8 caractères)
- Complexité (majuscules, minuscules, chiffres, caractères spéciaux)
- Force du password (0-4 scale)
- Vérification contre le password actuel
- Retour structuré avec errors, warnings, strength

### Tests d'Authentification

Les tests de vérification de credentials couvrent:
- Username valide + password valide → retourne User
- Username invalide → retourne null
- Password invalide → retourne null
- Utilisation de bcrypt.compare pour vérifier

## Sécurité

Les tests vérifient que:
- ✅ Les passwords sont toujours hashés avec bcrypt (10 rounds)
- ✅ Les passwords ne sont jamais stockés en clair
- ✅ Les credentials sont vérifiés de manière sécurisée
- ✅ Les ConflictException empêchent les doublons
- ✅ Les NotFoundException protègent contre les énumérations
- ✅ Les passwords doivent respecter des règles de complexité
- ✅ Les passwords faibles sont détectés

## Formatage DisplayName

Les tests vérifient le formatage correct du displayName:
```typescript
displayName = `${firstName || ''} ${lastName || ''}`.trim() || username;
```

Exemples:
- `firstName: "John", lastName: "Doe"` → `"John Doe"`
- `firstName: "John", lastName: null` → `"John"`
- `firstName: null, lastName: null` → `username`

## Opérations en Masse

Les tests de bulk operations vérifient:
- Parsing correct des IDs CSV (`"1,2,3"`)
- Nettoyage des espaces (`" 1 , 2 , 3 "` → `["1", "2", "3"]`)
- Gestion des listes vides
- Retour structuré avec `requestedIds`, `found`, `users`/`migrationData`
