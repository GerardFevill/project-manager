# 🚀 Quick Start - GitHub Actions & Docker

## Ce qui a été ajouté

### ✅ Fichiers Docker
```
Dockerfile                  # Build optimisé multi-stage
.dockerignore              # Exclusion de fichiers
docker-compose.prod.yml    # Déploiement production
.env.production.example    # Variables d'environnement
test-docker.sh             # Script de test local
```

### ✅ GitHub Actions Workflows
```
.github/workflows/
├── ci.yml                 # Tests automatiques (lint, unit, e2e)
├── release.yml            # Versioning + Docker push automatique
└── docker-publish.yml     # Build Docker manuel
```

### ✅ Documentation
```
CONFIGURATION-RAPIDE.md     # Configuration automatique (2 min) ⚡ START HERE!
SETUP-GITHUB-ACTIONS.md     # Guide de configuration détaillé (5 min)
DEPLOYMENT.md               # Guide complet de déploiement
.github/workflows/README.md # Documentation des workflows
.github/SECRETS-SETUP.md    # Configuration des secrets DockerHub
setup-secrets.sh            # Script de configuration automatique
```

### ✅ Code
```
src/app.controller.ts      # Endpoint /health ajouté
```

---

## 🎯 Configuration automatique en 2 minutes

### Méthode automatique (RECOMMANDÉE) ⚡

```bash
# 1. Installer GitHub CLI (si pas déjà fait)
# Ubuntu/Debian: sudo apt install gh
# macOS: brew install gh

# 2. S'authentifier
gh auth login

# 3. Exécuter le script de configuration
./setup-secrets.sh
```

Le script vous demandera vos identifiants DockerHub et configurera tout automatiquement !

**📖 Guide complet:** `CONFIGURATION-RAPIDE.md`

---

### Méthode manuelle (alternative)

**Voir le guide complet:** `.github/SECRETS-SETUP.md`

Résumé:
1. Créer un token DockerHub (https://hub.docker.com/settings/security)
2. Ajouter les secrets GitHub (Settings → Secrets and variables → Actions)
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
3. Activer les permissions GitHub Actions
   - Settings → Actions → General → Workflow permissions
   - ✅ Read and write permissions
   - ✅ Allow GitHub Actions to create and approve pull requests

---

## 🔄 Comment ça marche

### Déploiement automatique
```bash
# 1. Committer avec message conventionnel
git add .
git commit -m "feat: add new feature"  # → version MINOR (0.0.1 → 0.1.0)
git push origin main

# 2. GitHub Actions fait automatiquement:
# ✓ Lance les tests
# ✓ Bump la version
# ✓ Crée un tag Git
# ✓ Build l'image Docker (multi-arch)
# ✓ Push sur DockerHub
# ✓ Crée une release GitHub
```

### Convention de commits
| Message | Version | Exemple |
|---------|---------|---------|
| `fix: ...` | PATCH | 0.0.1 → 0.0.2 |
| `feat: ...` | MINOR | 0.0.1 → 0.1.0 |
| `feat!: ...` | MAJOR | 0.0.1 → 1.0.0 |

---

## 🧪 Tester localement

### Option 1: Script automatique
```bash
./test-docker.sh
```

### Option 2: Manuel
```bash
# Build
docker build -t project-manager:test .

# Run
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  project-manager:test

# Test
curl http://localhost:3000/health
```

---

## 🌍 Déployer en production

### Avec Docker Compose
```bash
# 1. Créer un fichier .env
cp .env.production.example .env
# Éditer .env avec vos valeurs

# 2. Démarrer
export DOCKERHUB_USERNAME=votre-username
docker-compose -f docker-compose.prod.yml up -d

# 3. Vérifier
curl http://localhost:3000/health
```

### Avec Docker seul
```bash
# PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Application
docker run -d \
  --name project-manager \
  -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  votre-username/project-manager:latest
```

---

## 📚 Documentation complète

- **Setup rapide**: `SETUP-GITHUB-ACTIONS.md`
- **Déploiement détaillé**: `DEPLOYMENT.md`
- **Workflows**: `.github/workflows/README.md`

---

## 🎉 C'est prêt !

Votre pipeline CI/CD est configuré. Chaque push sur `main` déclenchera automatiquement:
1. Tests (lint + unit + e2e)
2. Versioning automatique
3. Build Docker multi-architecture
4. Push sur DockerHub
5. Release GitHub

**Prochaine étape**: Pusher sur `main` et regarder la magie opérer ! ✨
