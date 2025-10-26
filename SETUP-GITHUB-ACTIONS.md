# Configuration rapide - GitHub Actions & DockerHub

## Fichiers créés ✅

### Docker
- ✅ `Dockerfile` - Image multi-stage optimisée pour production
- ✅ `.dockerignore` - Exclusion des fichiers inutiles
- ✅ `docker-compose.prod.yml` - Déploiement production avec PostgreSQL

### GitHub Actions Workflows
- ✅ `.github/workflows/ci.yml` - Tests et linting automatiques
- ✅ `.github/workflows/release.yml` - Versioning automatique + déploiement Docker
- ✅ `.github/workflows/docker-publish.yml` - Build Docker manuel

### Documentation
- ✅ `.github/workflows/README.md` - Documentation des workflows
- ✅ `DEPLOYMENT.md` - Guide complet de déploiement
- ✅ Endpoint `/health` ajouté dans `src/app.controller.ts`

---

## Configuration en 5 minutes ⚡

### 1️⃣ Créer un token DockerHub

```bash
# 1. Aller sur https://hub.docker.com
# 2. Account Settings → Security → New Access Token
# 3. Nom: github-actions
# 4. Permissions: Read & Write
# 5. Copier le token (il ne sera plus visible!)
```

### 2️⃣ Ajouter les secrets GitHub

Dans votre repository GitHub:

```
Settings → Secrets and variables → Actions → New repository secret
```

Ajouter **2 secrets**:

| Nom | Valeur |
|-----|--------|
| `DOCKERHUB_USERNAME` | Votre nom d'utilisateur DockerHub |
| `DOCKERHUB_TOKEN` | Le token créé à l'étape 1 |

### 3️⃣ Activer les permissions GitHub Actions

```
Settings → Actions → General → Workflow permissions
```

Cocher:
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### 4️⃣ Tester le workflow

```bash
# Option A: Push sur main (déclenche tout automatiquement)
git add .
git commit -m "feat: setup CI/CD with Docker and versioning"
git push origin main

# Option B: Déclenchement manuel
# GitHub → Actions → "Release - Version & Deploy" → Run workflow
```

---

## Comment ça marche ? 🔄

### Workflow automatique

```
┌─────────────────────────────────────────────────────────────┐
│  1. DÉVELOPPEMENT                                           │
│     git commit -m "feat: add new feature"                   │
│     git push origin main                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  2. CI - TESTS (ci.yml)                                     │
│     ✓ Lint                                                  │
│     ✓ Tests unitaires                                       │
│     ✓ Tests E2E                                             │
│     ✓ Build                                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  3. VERSIONING (release.yml)                                │
│     • Analyse du commit: "feat:" → version MINOR            │
│     • Bump: 0.0.1 → 0.1.0                                   │
│     • Création tag: v0.1.0                                  │
│     • Commit + push du tag                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  4. DOCKER BUILD & PUSH (release.yml)                       │
│     • Build image multi-arch (amd64 + arm64)                │
│     • Tags: 0.1.0, 0.1, 0, latest                           │
│     • Push vers DockerHub                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  5. RELEASE GITHUB                                          │
│     • Création release v0.1.0                               │
│     • Notes de version automatiques                         │
│     • Lien vers image Docker                                │
└─────────────────────────────────────────────────────────────┘
```

### Convention de commits → Versioning

| Message de commit | Version bump | Exemple |
|-------------------|--------------|---------|
| `fix: ...` | **PATCH** | 0.0.1 → 0.0.2 |
| `feat: ...` | **MINOR** | 0.0.1 → 0.1.0 |
| `feat!: ...` ou `BREAKING CHANGE:` | **MAJOR** | 0.0.1 → 1.0.0 |

---

## Commandes utiles 🛠️

### Développement

```bash
# Tester le Dockerfile localement
docker build -t project-manager:test .
docker run -p 3000:3000 project-manager:test

# Health check
curl http://localhost:3000/health
```

### Production

```bash
# Déployer avec Docker Compose
export DOCKERHUB_USERNAME=votre-username
export VERSION=latest  # ou 0.1.0
docker-compose -f docker-compose.prod.yml up -d

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f app

# Mise à jour
docker-compose -f docker-compose.prod.yml pull app
docker-compose -f docker-compose.prod.yml up -d app
```

### GitHub CLI

```bash
# Déclencher un release manuel
gh workflow run release.yml -f version_bump=minor

# Voir les workflows actifs
gh run list

# Voir les logs d'un workflow
gh run view <run-id> --log

# Déclencher un build Docker seul
gh workflow run docker-publish.yml -f tag=1.0.0 -f latest=true
```

---

## Vérifications ✓

### Avant le premier déploiement

- [ ] Token DockerHub créé avec permissions **Read & Write**
- [ ] Secrets GitHub configurés: `DOCKERHUB_USERNAME` + `DOCKERHUB_TOKEN`
- [ ] Permissions GitHub Actions activées
- [ ] Branche `main` existe
- [ ] Tests passent localement: `npm test`
- [ ] Build fonctionne: `npm run build`

### Après le premier déploiement

- [ ] Tag Git créé: `git tag`
- [ ] Release GitHub visible: GitHub → Releases
- [ ] Image sur DockerHub: `docker pull <username>/project-manager:latest`
- [ ] Health check fonctionne: `curl http://localhost:3000/health`

---

## Troubleshooting 🔧

### Erreur: "Resource not accessible by integration"
**Solution**: Activer les permissions GitHub Actions (étape 3)

### Erreur: "unauthorized: authentication required"
**Solution**: Vérifier que `DOCKERHUB_TOKEN` est correct et a les bonnes permissions

### Workflow ne se déclenche pas
**Solution**: Vérifier que vous pushez sur la branche `main`

### Version ne change pas
**Solution**: Utiliser des messages de commit conventionnels (`feat:`, `fix:`, etc.)

### Tests échouent en CI
**Solution**: Vérifier que PostgreSQL démarre bien (health check dans ci.yml)

---

## Structure des tags Docker 🏷️

Chaque release crée plusieurs tags:

```bash
# Version v0.1.2 crée:
username/project-manager:0.1.2    # Version exacte
username/project-manager:0.1      # Version majeure.mineure
username/project-manager:0        # Version majeure
username/project-manager:latest   # Dernière version

# Utilisation
docker pull username/project-manager:latest      # Dernière version (production)
docker pull username/project-manager:0.1.2       # Version spécifique (stable)
docker pull username/project-manager:0.1         # Dernière patch de 0.1.x
```

---

## Prochaines étapes 🚀

### Améliorations recommandées

1. **Tests de sécurité**
   ```yaml
   # Ajouter dans ci.yml
   - name: Security audit
     run: npm audit --audit-level=high
   ```

2. **Analyse de code**
   ```yaml
   # Ajouter SonarCloud ou CodeQL
   - uses: github/codeql-action/analyze@v2
   ```

3. **Notifications**
   ```yaml
   # Ajouter Slack/Discord notifications
   - uses: 8398a7/action-slack@v3
   ```

4. **Staging environment**
   - Créer une branche `develop`
   - Déployer automatiquement sur un environnement de staging

5. **Database migrations**
   - Intégrer Liquibase dans le workflow de release
   - Automatiser les migrations avant le déploiement

---

## Support 📚

- **Documentation complète**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Workflows**: [.github/workflows/README.md](.github/workflows/README.md)
- **Projet**: [CLAUDE.md](./CLAUDE.md)

---

## Exemples concrets 💡

### Déployer une nouvelle fonctionnalité

```bash
# 1. Créer une branche
git checkout -b feature/user-auth

# 2. Développer
# ... coder ...

# 3. Tester localement
npm test
npm run build

# 4. Committer avec message conventionnel
git add .
git commit -m "feat: add user authentication with JWT"

# 5. Push et créer PR
git push origin feature/user-auth
# Créer PR sur GitHub

# 6. Merger dans main
# → GitHub Actions lance automatiquement:
#    - Tests
#    - Bump version (0.0.1 → 0.1.0)
#    - Build Docker
#    - Push DockerHub
#    - Release GitHub
```

### Corriger un bug critique

```bash
# 1. Fix rapide sur main
git checkout main
git pull

# 2. Corriger le bug
# ... coder ...

# 3. Committer et pousser
git add .
git commit -m "fix: resolve database connection timeout"
git push origin main

# → Version 0.1.0 → 0.1.1 automatiquement
# → Image Docker mise à jour sur DockerHub
```

### Déployer manuellement une version

```bash
# Via GitHub CLI
gh workflow run release.yml -f version_bump=major

# Ou via GitHub Web UI:
# Actions → Release - Version & Deploy → Run workflow → major
```

---

**C'est prêt ! 🎉**

Votre pipeline CI/CD est configuré. Chaque push sur `main` déclenchera automatiquement les tests, le versioning et le déploiement Docker.
