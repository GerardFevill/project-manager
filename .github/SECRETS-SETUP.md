# Configuration automatique des secrets DockerHub

## Option 1: Script automatique (RECOMMANDÉ) ⚡

### Prérequis
1. Installer GitHub CLI:
```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# Autres: https://cli.github.com/
```

2. S'authentifier:
```bash
gh auth login
```

### Exécution du script

```bash
./setup-secrets.sh
```

Le script vous demandera:
1. Votre nom d'utilisateur DockerHub
2. Votre token DockerHub

Et configurera automatiquement les secrets GitHub !

---

## Option 2: Configuration manuelle via GitHub CLI 🔧

```bash
# Définir les secrets
echo "votre-username" | gh secret set DOCKERHUB_USERNAME
echo "votre-token" | gh secret set DOCKERHUB_TOKEN

# Vérifier
gh secret list
```

---

## Option 3: Configuration manuelle via interface web 🌐

### Étape 1: Créer un token DockerHub

1. Aller sur https://hub.docker.com
2. Se connecter
3. Account Settings → Security
4. **New Access Token**
5. Nom: `github-actions`
6. Permissions: **Read & Write**
7. **Copier le token** (il ne sera plus visible!)

### Étape 2: Ajouter les secrets GitHub

1. Aller sur votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer sur **New repository secret**

#### Secret 1: DOCKERHUB_USERNAME
- Name: `DOCKERHUB_USERNAME`
- Secret: `votre-nom-utilisateur-dockerhub`
- Cliquer sur **Add secret**

#### Secret 2: DOCKERHUB_TOKEN
- Name: `DOCKERHUB_TOKEN`
- Secret: `le-token-copié-depuis-dockerhub`
- Cliquer sur **Add secret**

### Étape 3: Activer les permissions

1. **Settings** → **Actions** → **General**
2. Scroll vers **Workflow permissions**
3. Cocher:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
4. Cliquer sur **Save**

---

## Vérification ✓

### Vérifier que les secrets sont configurés

Via GitHub CLI:
```bash
gh secret list
```

Via interface web:
```
Settings → Secrets and variables → Actions
```

Vous devriez voir:
- ✅ DOCKERHUB_USERNAME
- ✅ DOCKERHUB_TOKEN

---

## Tester le workflow 🧪

```bash
# Commit avec message conventionnel
git add .
git commit -m "feat: setup CI/CD with Docker"
git push origin main

# Voir les workflows en cours
gh run list

# Voir les logs
gh run view --log
```

---

## Obtenir votre token DockerHub 🔑

Si vous n'avez pas encore de token:

1. **Connexion**: https://hub.docker.com/settings/security
2. **New Access Token**:
   - Description: `github-actions` ou `project-manager-ci`
   - Access permissions: **Read & Write**
3. **Generate**
4. **Copier le token** (format: `dckr_pat_...`)
5. ⚠️ **Important**: Sauvegarder le token dans un endroit sûr, il ne sera plus visible

---

## Sécurité 🔒

### ✅ Bonnes pratiques

- ✅ Utiliser des tokens d'accès (pas le mot de passe)
- ✅ Permissions minimales (Read & Write uniquement)
- ✅ Nom descriptif pour le token
- ✅ Ne jamais committer les secrets dans Git
- ✅ Utiliser GitHub Secrets (chiffrés au repos)

### ❌ À éviter

- ❌ Ne jamais mettre le token dans le code
- ❌ Ne jamais committer `.env` avec secrets
- ❌ Ne pas partager les tokens
- ❌ Ne pas utiliser le mot de passe DockerHub directement

---

## Troubleshooting 🔧

### Erreur: "gh: command not found"
**Solution**: Installer GitHub CLI (voir Option 1)

### Erreur: "authentication required"
**Solution**:
```bash
gh auth login
```

### Erreur: "Resource not accessible by integration"
**Solution**: Activer les permissions GitHub Actions (Étape 3)

### Erreur: "unauthorized: authentication required" (DockerHub)
**Solutions**:
1. Vérifier que `DOCKERHUB_USERNAME` est correct
2. Vérifier que `DOCKERHUB_TOKEN` est un token valide (pas le mot de passe)
3. Vérifier que le token a les permissions Read & Write
4. Régénérer un nouveau token si nécessaire

### Le workflow ne se déclenche pas
**Solutions**:
1. Vérifier que vous pushez sur la branche `main`
2. Vérifier que les workflows sont activés (Settings → Actions)
3. Vérifier les permissions (Settings → Actions → General)

---

## Commandes utiles 💡

```bash
# Lister les secrets
gh secret list

# Supprimer un secret
gh secret delete DOCKERHUB_USERNAME
gh secret delete DOCKERHUB_TOKEN

# Reconfigurer
./setup-secrets.sh

# Voir les workflows
gh workflow list

# Déclencher un workflow manuellement
gh workflow run release.yml -f version_bump=patch

# Voir les runs
gh run list

# Voir les logs d'un run
gh run view <run-id> --log

# Voir le statut
gh run watch
```

---

## Après la configuration 🎉

Une fois les secrets configurés, chaque push sur `main` déclenchera:

1. ✅ Tests (lint + unit + e2e)
2. ✅ Bump de version automatique
3. ✅ Build de l'image Docker
4. ✅ Push sur DockerHub
5. ✅ Création d'une release GitHub

**Plus rien à faire manuellement !** 🚀
