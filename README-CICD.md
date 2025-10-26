# 🚀 CI/CD avec GitHub Actions & DockerHub - Guide complet

## 📋 Résumé

Ce projet est configuré avec un pipeline CI/CD complet pour:
- ✅ Tester automatiquement le code (lint, unit tests, e2e)
- ✅ Versionner automatiquement selon les commits
- ✅ Builder et publier sur DockerHub
- ✅ Créer des releases GitHub

---

## ⚡ DÉMARRAGE RAPIDE

### Configuration automatique (2 minutes)

```bash
# 1. Installer GitHub CLI
sudo apt install gh  # ou: brew install gh (macOS)

# 2. S'authentifier
gh auth login

# 3. Configurer les secrets DockerHub
./setup-secrets.sh
```

**C'est tout !** Le script vous guide pour configurer vos identifiants DockerHub.

**📖 Plus de détails:** `CONFIGURATION-RAPIDE.md`

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| **CONFIGURATION-RAPIDE.md** | 🚀 Configuration en 2 min (START HERE!) |
| **SETUP-GITHUB-ACTIONS.md** | 📖 Guide détaillé de configuration |
| **.github/SECRETS-SETUP.md** | 🔐 Configuration des secrets (3 méthodes) |
| **DEPLOYMENT.md** | 🌍 Déploiement production |
| **.github/workflows/README.md** | ⚙️ Documentation des workflows |
| **QUICK-START.md** | 📝 Vue d'ensemble complète |

---

## 🛠️ Scripts disponibles

| Script | Usage |
|--------|-------|
| `./setup-secrets.sh` | Configuration automatique des secrets GitHub |
| `./test-docker.sh` | Test du build Docker en local |

---

## 🔄 Workflow automatique

```
┌────────────────────────────────────────────────────────────┐
│  1. Développement                                          │
│     git commit -m "feat: nouvelle fonctionnalité"          │
│     git push origin main                                   │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  2. Tests automatiques (ci.yml)                            │
│     • ESLint                                               │
│     • Tests unitaires                                      │
│     • Tests E2E                                            │
│     • Build                                                │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  3. Versioning automatique (release.yml)                   │
│     • Analyse: "feat:" → MINOR                             │
│     • Bump: 0.0.1 → 0.1.0                                  │
│     • Tag: v0.1.0                                          │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  4. Docker Build & Push (release.yml)                      │
│     • Build multi-arch (amd64 + arm64)                     │
│     • Tags: 0.1.0, 0.1, 0, latest                          │
│     • Push vers DockerHub                                  │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────┐
│  5. GitHub Release                                         │
│     • Release v0.1.0                                       │
│     • Notes automatiques                                   │
└────────────────────────────────────────────────────────────┘
```

---

## 🏷️ Convention de versioning

| Commit | Version | Exemple |
|--------|---------|---------|
| `fix: correction bug` | PATCH | 0.0.1 → 0.0.2 |
| `feat: nouvelle fonctionnalité` | MINOR | 0.0.1 → 0.1.0 |
| `feat!: breaking change` | MAJOR | 0.0.1 → 1.0.0 |

**Plus d'exemples:**
```bash
git commit -m "fix: correct database timeout"        # 0.0.1 → 0.0.2
git commit -m "feat: add user authentication"        # 0.1.0 → 0.2.0
git commit -m "feat!: redesign API endpoints"        # 1.0.0 → 2.0.0
```

---

## 💻 Commandes utiles

### Configuration

```bash
# Installer GitHub CLI
sudo apt install gh         # Ubuntu/Debian
brew install gh             # macOS

# Authentification
gh auth login

# Configurer les secrets
./setup-secrets.sh

# Vérifier les secrets
gh secret list
```

### Tests locaux

```bash
# Test Docker automatique
./test-docker.sh

# Build manuel
docker build -t project-manager:test .

# Run manuel
docker run -p 3000:3000 project-manager:test

# Health check
curl http://localhost:3000/health
```

### Workflows GitHub Actions

```bash
# Voir les workflows
gh workflow list

# Déclencher un release (MINOR)
gh workflow run release.yml -f version_bump=minor

# Déclencher un release (MAJOR)
gh workflow run release.yml -f version_bump=major

# Déclencher un build Docker seul
gh workflow run docker-publish.yml -f tag=1.0.0 -f latest=true

# Voir les runs en cours
gh run list

# Voir les logs
gh run view --log

# Suivre un run en temps réel
gh run watch
```

### Production

```bash
# Déploiement avec Docker Compose
export DOCKERHUB_USERNAME=votre-username
docker-compose -f docker-compose.prod.yml up -d

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f app

# Mise à jour
docker-compose -f docker-compose.prod.yml pull app
docker-compose -f docker-compose.prod.yml up -d app

# Arrêt
docker-compose -f docker-compose.prod.yml down
```

---

## 🔐 Sécurité

### Secrets requis

| Secret | Description | Où l'obtenir |
|--------|-------------|--------------|
| `DOCKERHUB_USERNAME` | Nom d'utilisateur DockerHub | https://hub.docker.com |
| `DOCKERHUB_TOKEN` | Token d'accès DockerHub | https://hub.docker.com/settings/security |

### Bonnes pratiques

- ✅ Utiliser des tokens (pas de mots de passe)
- ✅ Permissions minimales (Read & Write)
- ✅ Ne jamais committer les secrets
- ✅ Rotation régulière des tokens
- ❌ Ne jamais mettre de secrets dans le code

---

## 🧪 Tests

### Tests locaux avant push

```bash
# Linting
npm run lint

# Tests unitaires
npm test

# Tests avec couverture
npm run test:cov

# Tests E2E
npm run test:e2e

# Build
npm run build
```

### Tests Docker

```bash
# Build et test complet
./test-docker.sh

# Build seul
docker build -t project-manager:test .

# Run avec variables d'environnement
docker run -p 3000:3000 \
  -e DB_HOST=localhost \
  -e DB_PORT=5432 \
  -e DB_USERNAME=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_DATABASE=project_manager \
  project-manager:test
```

---

## 🎯 Workflows disponibles

### 1. CI - Tests automatiques (`ci.yml`)

**Déclenché par:** Push ou PR sur `main` ou `develop`

**Actions:**
- Lint du code
- Tests unitaires avec couverture
- Tests E2E
- Build de l'application

### 2. Release - Versioning & Déploiement (`release.yml`)

**Déclenché par:** 
- Push sur `main` (automatique)
- Manuellement via GitHub Actions

**Actions:**
- Détection du type de version
- Bump de version
- Création du tag Git
- Build Docker multi-arch
- Push sur DockerHub
- Création release GitHub

### 3. Docker - Build manuel (`docker-publish.yml`)

**Déclenché par:** Manuellement uniquement

**Actions:**
- Build image Docker
- Push sur DockerHub avec tag personnalisé

---

## 📊 Après le déploiement

### Images Docker disponibles

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

### Vérifier le déploiement

```bash
# Health check
curl http://localhost:3000/health

# Logs
docker logs -f project-manager-app

# Stats
docker stats project-manager-app
```

---

## 🆘 Troubleshooting

### Erreur: "gh: command not found"
**Solution:** Installer GitHub CLI (voir section Configuration)

### Erreur: "unauthorized: authentication required"
**Solutions:**
1. Vérifier `DOCKERHUB_USERNAME` et `DOCKERHUB_TOKEN`
2. Régénérer le token DockerHub
3. Reconfigurer les secrets: `./setup-secrets.sh`

### Workflow ne se déclenche pas
**Solutions:**
1. Vérifier la branche (doit être `main`)
2. Vérifier les permissions (Settings → Actions)
3. Vérifier que les workflows sont activés

### Tests échouent en CI
**Solutions:**
1. Lancer les tests localement: `npm test`
2. Vérifier les logs GitHub Actions
3. Vérifier la connexion PostgreSQL

---

## ✅ Checklist de configuration

- [ ] GitHub CLI installé
- [ ] Authentifié avec GitHub (`gh auth login`)
- [ ] Script `setup-secrets.sh` exécuté
- [ ] Secrets configurés (vérifier avec `gh secret list`)
- [ ] Permissions GitHub Actions activées
- [ ] Tests passent localement (`npm test`)
- [ ] Build Docker fonctionne (`./test-docker.sh`)
- [ ] Premier push sur `main` effectué
- [ ] Workflow GitHub Actions réussi

---

## 🎉 Prochaines étapes

1. ✅ Configurer les secrets (2 min): `./setup-secrets.sh`
2. ✅ Tester localement: `./test-docker.sh`
3. ✅ Push sur main: `git push origin main`
4. ✅ Vérifier le workflow: `gh run watch`
5. ✅ Vérifier l'image sur DockerHub

**C'est tout ! Votre CI/CD est opérationnel ! 🚀**

---

## 📞 Support

- **Issues GitHub:** Pour rapporter des bugs
- **Discussions:** Pour poser des questions
- **Documentation:** Voir les fichiers listés au début

