# Guide de déploiement - Project Manager

Ce guide explique comment déployer l'application Project Manager avec Docker et GitHub Actions.

## Table des matières
- [Pré-requis](#pré-requis)
- [Configuration GitHub Actions](#configuration-github-actions)
- [Déploiement automatique](#déploiement-automatique)
- [Déploiement manuel](#déploiement-manuel)
- [Production avec Docker](#production-avec-docker)

---

## Pré-requis

### 1. Compte DockerHub
Créer un compte sur [hub.docker.com](https://hub.docker.com)

### 2. Token d'accès DockerHub
1. Se connecter à DockerHub
2. Account Settings → Security
3. New Access Token
4. Nom: `github-actions`
5. Permissions: **Read & Write**
6. Copier le token (il ne sera plus visible)

### 3. Repository GitHub
Le code doit être hébergé sur GitHub avec les workflows dans `.github/workflows/`

---

## Configuration GitHub Actions

### Étape 1: Ajouter les secrets

Dans votre repository GitHub:

1. Settings → Secrets and variables → Actions
2. Ajouter les secrets suivants:

| Secret | Description | Exemple |
|--------|-------------|---------|
| `DOCKERHUB_USERNAME` | Nom d'utilisateur DockerHub | `johndoe` |
| `DOCKERHUB_TOKEN` | Token d'accès DockerHub | `dckr_pat_xxxxx...` |

### Étape 2: Configurer les permissions

Settings → Actions → General → Workflow permissions:
- ✅ **Read and write permissions**
- ✅ **Allow GitHub Actions to create and approve pull requests**

### Étape 3: Vérifier les workflows

Les workflows suivants doivent être présents:
- `.github/workflows/ci.yml` - Tests et linting
- `.github/workflows/release.yml` - Versioning et déploiement
- `.github/workflows/docker-publish.yml` - Build Docker manuel

---

## Déploiement automatique

### Fonctionnement

Chaque push sur `main` déclenche automatiquement:

1. **Tests** (`ci.yml`)
   - Linting
   - Tests unitaires
   - Tests E2E
   - Build

2. **Release** (`release.yml`)
   - Analyse des commits pour déterminer le type de version
   - Bump automatique de version
   - Création d'un tag Git
   - Build et push de l'image Docker
   - Création d'une release GitHub

### Convention de commits

Le type de version est déterminé par vos messages de commit:

```bash
# PATCH (0.0.X) - Corrections de bugs
git commit -m "fix: correct database connection timeout"

# MINOR (0.X.0) - Nouvelles fonctionnalités
git commit -m "feat: add task priority filtering"

# MAJOR (X.0.0) - Breaking changes
git commit -m "feat!: redesign API endpoints"
# ou
git commit -m "feat: redesign API

BREAKING CHANGE: API endpoints have changed"
```

### Workflow de déploiement

```bash
# 1. Développer la fonctionnalité
git checkout -b feature/task-priority
# ... coder ...

# 2. Committer avec message conventionnel
git add .
git commit -m "feat: add priority field to tasks"

# 3. Pousser et créer une PR
git push origin feature/task-priority
# Créer PR sur GitHub

# 4. Merger dans main (après review)
# GitHub Actions va automatiquement:
# - Lancer les tests
# - Bumper la version (0.0.1 → 0.1.0)
# - Créer le tag v0.1.0
# - Build l'image Docker
# - Pusher sur DockerHub
# - Créer une release GitHub
```

---

## Déploiement manuel

### Option 1: Via GitHub Web UI

1. Aller dans **Actions**
2. Sélectionner **"Release - Version & Deploy"**
3. Cliquer sur **"Run workflow"**
4. Choisir le type de version:
   - `patch`: 0.0.1 → 0.0.2
   - `minor`: 0.0.1 → 0.1.0
   - `major`: 0.0.1 → 1.0.0
5. Cliquer sur **"Run workflow"**

### Option 2: Via GitHub CLI

```bash
# Installer GitHub CLI
# https://cli.github.com/

# Bumper une version patch
gh workflow run release.yml -f version_bump=patch

# Bumper une version minor
gh workflow run release.yml -f version_bump=minor

# Bumper une version major
gh workflow run release.yml -f version_bump=major
```

### Option 3: Build Docker uniquement

Pour publier une image Docker sans créer de release:

```bash
# Via GitHub Web UI
Actions → "Docker - Build & Publish (Manual)" → Run workflow

# Via CLI
gh workflow run docker-publish.yml -f tag=custom-tag -f latest=true
```

---

## Production avec Docker

### Option 1: Docker Compose (Recommandé)

#### Créer un fichier `.env`

```bash
# Application
APP_PORT=3000
VERSION=latest  # ou version spécifique: 0.1.0

# DockerHub
DOCKERHUB_USERNAME=votre-username

# Database
DB_USERNAME=postgres
DB_PASSWORD=votre-mot-de-passe-sécurisé
DB_DATABASE=project_manager
DB_PORT=5432
```

#### Démarrer l'application

```bash
# Télécharger docker-compose.prod.yml
wget https://raw.githubusercontent.com/votre-username/project-manager/main/docker-compose.prod.yml

# Ou créer manuellement avec le contenu fourni

# Démarrer
docker-compose -f docker-compose.prod.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f app

# Vérifier le status
curl http://localhost:3000/health
```

#### Arrêter l'application

```bash
docker-compose -f docker-compose.prod.yml down

# Avec suppression des données
docker-compose -f docker-compose.prod.yml down -v
```

### Option 2: Docker Run (Simple)

#### Démarrer PostgreSQL

```bash
docker run -d \
  --name project-manager-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=project_manager \
  -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

#### Démarrer l'application

```bash
docker run -d \
  --name project-manager-app \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=project_manager \
  --link project-manager-db:postgres \
  votre-username/project-manager:latest
```

### Option 3: Kubernetes

#### Créer les manifests

`deployment.yml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-manager
spec:
  replicas: 3
  selector:
    matchLabels:
      app: project-manager
  template:
    metadata:
      labels:
        app: project-manager
    spec:
      containers:
      - name: app
        image: votre-username/project-manager:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: "postgres-service"
        - name: DB_PORT
          value: "5432"
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Déployer

```bash
kubectl apply -f deployment.yml
kubectl apply -f service.yml
```

---

## Mise à jour en production

### Avec Docker Compose

```bash
# 1. Pull la nouvelle version
docker-compose -f docker-compose.prod.yml pull app

# 2. Redémarrer avec zero-downtime
docker-compose -f docker-compose.prod.yml up -d app

# 3. Vérifier
curl http://localhost:3000/health
```

### Avec Docker Run

```bash
# 1. Pull la nouvelle image
docker pull votre-username/project-manager:latest

# 2. Arrêter l'ancien conteneur
docker stop project-manager-app
docker rm project-manager-app

# 3. Démarrer le nouveau
docker run -d \
  --name project-manager-app \
  -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  # ... autres variables ...
  votre-username/project-manager:latest
```

---

## Rollback

### Revenir à une version antérieure

```bash
# Lister les versions disponibles
docker images votre-username/project-manager

# Démarrer avec une version spécifique
export VERSION=0.0.1
docker-compose -f docker-compose.prod.yml up -d
```

### Rollback Git + Redéploiement

```bash
# 1. Identifier le commit à restaurer
git log

# 2. Créer un commit de revert
git revert <commit-hash>

# 3. Pousser
git push origin main

# GitHub Actions va automatiquement redéployer
```

---

## Monitoring

### Vérifier la santé de l'application

```bash
# Health check
curl http://localhost:3000/health

# Response:
# {"status":"ok","timestamp":"2025-10-26T..."}
```

### Logs

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml logs -f app

# Docker Run
docker logs -f project-manager-app

# Dernières 100 lignes
docker logs --tail 100 project-manager-app
```

### Statistiques

```bash
# Utilisation CPU/Mémoire
docker stats project-manager-app

# Informations détaillées
docker inspect project-manager-app
```

---

## Troubleshooting

### L'application ne démarre pas

```bash
# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs app

# Vérifier que la DB est démarrée
docker-compose -f docker-compose.prod.yml ps postgres

# Tester la connexion DB
docker exec -it project-manager-db psql -U postgres -d project_manager
```

### L'image Docker n'est pas trouvée

```bash
# Vérifier que l'image existe sur DockerHub
docker search votre-username/project-manager

# Pull manuel
docker pull votre-username/project-manager:latest

# Login DockerHub
docker login
```

### GitHub Actions échoue

```bash
# Vérifier les logs
gh run list
gh run view <run-id> --log

# Vérifier les secrets
# Settings → Secrets → Vérifier DOCKERHUB_USERNAME et DOCKERHUB_TOKEN
```

---

## Sécurité en production

### Variables d'environnement

**Ne jamais** committer de fichiers `.env` avec des secrets.

Utiliser des gestionnaires de secrets:
- Docker Secrets (Swarm)
- Kubernetes Secrets
- HashiCorp Vault
- AWS Secrets Manager

### Network isolation

```bash
# Créer un réseau privé
docker network create --driver bridge project-manager-net

# Attacher seulement les conteneurs nécessaires
docker run --network project-manager-net ...
```

### Updates de sécurité

```bash
# Scanner l'image pour les vulnérabilités
docker scan votre-username/project-manager:latest

# Mettre à jour régulièrement les dépendances
npm audit
npm audit fix
```

---

## Support

Pour plus d'informations:
- [Documentation des workflows](.github/workflows/README.md)
- [Documentation générale](./CLAUDE.md)
- [Issues GitHub](https://github.com/votre-username/project-manager/issues)
