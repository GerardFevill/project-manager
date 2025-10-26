# GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour le CI/CD du projet.

## Workflows disponibles

### 1. CI - Test & Lint (`ci.yml`)

**Déclenchement:** Push ou PR sur `main` ou `develop`

**Actions:**
- ✅ Linting du code (ESLint)
- ✅ Tests unitaires avec couverture
- ✅ Tests E2E
- ✅ Build de l'application
- 📊 Upload des rapports de couverture vers Codecov

**Services:**
- PostgreSQL 16 (pour les tests)

---

### 2. Release - Version & Deploy (`release.yml`)

**Déclenchement:**
- Push sur `main` (auto-détection du type de version)
- Manuel via workflow_dispatch (choix du type de version)

**Actions:**
1. **Versioning automatique:**
   - Détection du type de bump (major/minor/patch)
   - Basé sur les messages de commit (Conventional Commits)
   - Mise à jour de `package.json`
   - Création d'un tag Git
   - Création d'une release GitHub

2. **Build & Push Docker:**
   - Build multi-architecture (amd64 + arm64)
   - Push vers DockerHub
   - Tags: `version`, `major.minor`, `major`, `latest`
   - Cache optimisé pour builds rapides

**Convention de commits:**
- `BREAKING CHANGE:`, `feat!:`, `fix!:` → **major**
- `feat:` → **minor**
- Autres → **patch**

**Exemple de messages de commit:**
```bash
feat: add user authentication           # → minor bump
fix: correct database connection       # → patch bump
feat!: redesign API endpoints          # → major bump
```

---

### 3. Docker - Build & Publish Manual (`docker-publish.yml`)

**Déclenchement:** Manuel uniquement (workflow_dispatch)

**Options:**
- `tag`: Tag personnalisé (par défaut: SHA du commit)
- `latest`: Inclure le tag `latest` (true/false)

**Usage:**
Idéal pour publier une version Docker sans créer de release.

---

## Configuration requise

### Secrets GitHub à configurer

Dans les paramètres du repository → Secrets and variables → Actions:

1. **DOCKERHUB_USERNAME**
   - Votre nom d'utilisateur DockerHub
   - Exemple: `johndoe`

2. **DOCKERHUB_TOKEN**
   - Token d'accès DockerHub (recommandé plutôt que le mot de passe)
   - Création: DockerHub → Account Settings → Security → New Access Token
   - Permissions requises: Read & Write

### Permissions GitHub Actions

Dans Settings → Actions → General → Workflow permissions:
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

---

## Utilisation

### Déploiement automatique

```bash
# 1. Développer et committer avec des messages conventionnels
git add .
git commit -m "feat: add task priority filtering"

# 2. Pousser sur main
git push origin main

# 3. GitHub Actions:
#    - Lance les tests (ci.yml)
#    - Bump la version (minor car "feat:")
#    - Build et push l'image Docker
#    - Crée une release GitHub
```

### Déploiement manuel

Via GitHub Web UI:
1. Actions → "Release - Version & Deploy"
2. Run workflow
3. Choisir le type de version (patch/minor/major)
4. Run

Ou via GitHub CLI:
```bash
gh workflow run release.yml -f version_bump=minor
```

### Build Docker manuel

```bash
# Via GitHub Web UI
Actions → "Docker - Build & Publish (Manual)" → Run workflow

# Via CLI
gh workflow run docker-publish.yml -f tag=1.2.3 -f latest=true
```

---

## Images Docker produites

Après chaque release, les images suivantes sont disponibles:

```bash
# Version spécifique
docker pull <username>/project-manager:0.1.0

# Version majeure.mineure
docker pull <username>/project-manager:0.1

# Version majeure
docker pull <username>/project-manager:0

# Latest
docker pull <username>/project-manager:latest
```

---

## Debugging

### Voir les logs d'un workflow
```bash
gh run list
gh run view <run-id> --log
```

### Tester le Dockerfile localement
```bash
# Build
docker build -t project-manager:test .

# Run
docker run -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=project_manager \
  project-manager:test
```

### Problèmes courants

**1. Erreur "version already exists"**
- La version existe déjà dans Git
- Solution: Supprimer le tag local et remote
  ```bash
  git tag -d v0.1.0
  git push origin :refs/tags/v0.1.0
  ```

**2. Erreur DockerHub authentication**
- Vérifier que les secrets DOCKERHUB_USERNAME et DOCKERHUB_TOKEN sont corrects
- Vérifier que le token a les permissions Read & Write

**3. Tests échouent en CI**
- Vérifier que PostgreSQL est bien démarré (health check)
- Vérifier les variables d'environnement de test

---

## Maintenance

### Mettre à jour les actions GitHub
Les actions utilisées ont des versions figées pour la stabilité. Pour les mettre à jour:

```bash
# Vérifier les nouvelles versions
gh extension install mheap/gh-action-update-action
gh action-update-action --check
```

### Nettoyer les anciennes images Docker
Les images de cache s'accumulent sur DockerHub. Les nettoyer régulièrement:
```bash
# Via DockerHub UI ou API
curl -X DELETE https://hub.docker.com/v2/repositories/<username>/project-manager/tags/buildcache/
```
