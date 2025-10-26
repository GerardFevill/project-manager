# ⚡ Configuration rapide - 2 minutes

## Vous avez vos identifiants DockerHub ?

Parfait ! Voici comment les configurer automatiquement.

---

## 🚀 Méthode rapide (RECOMMANDÉE)

### 1. Installer GitHub CLI (si pas déjà fait)

```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh

# Windows
winget install GitHub.cli
```

### 2. S'authentifier avec GitHub

```bash
gh auth login
```

Suivre les instructions à l'écran.

### 3. Exécuter le script de configuration

```bash
./setup-secrets.sh
```

Le script vous demandera:
- Votre `DOCKERHUB_USERNAME`
- Votre `DOCKERHUB_TOKEN`

Et configurera tout automatiquement ! ✅

---

## 💻 Méthode alternative (ligne de commande)

Si vous avez déjà GitHub CLI installé et authentifié:

```bash
# Remplacer avec vos vraies valeurs
echo "VOTRE_USERNAME" | gh secret set DOCKERHUB_USERNAME
echo "VOTRE_TOKEN" | gh secret set DOCKERHUB_TOKEN

# Vérifier
gh secret list
```

---

## 🌐 Méthode manuelle (interface web)

### 1. Obtenir votre token DockerHub

Si vous n'avez pas encore de token:

1. Aller sur https://hub.docker.com/settings/security
2. Cliquer sur **New Access Token**
3. Description: `github-actions`
4. Permissions: **Read & Write**
5. Cliquer sur **Generate**
6. **COPIER LE TOKEN** (il ne sera plus visible!)

### 2. Ajouter les secrets sur GitHub

1. Aller sur votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquer sur **New repository secret**

**Secret 1:**
- Name: `DOCKERHUB_USERNAME`
- Secret: votre nom d'utilisateur DockerHub
- **Add secret**

**Secret 2:**
- Name: `DOCKERHUB_TOKEN`
- Secret: le token copié à l'étape 1
- **Add secret**

### 3. Activer les permissions

1. **Settings** → **Actions** → **General**
2. Section **Workflow permissions**:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. **Save**

---

## ✅ Vérification

Vérifier que les secrets sont bien configurés:

```bash
gh secret list
```

Ou via GitHub web:
```
Settings → Secrets and variables → Actions
```

Vous devriez voir:
- ✅ DOCKERHUB_USERNAME
- ✅ DOCKERHUB_TOKEN

---

## 🧪 Test

```bash
# Faire un commit
git add .
git commit -m "feat: setup CI/CD"
git push origin main

# Voir le workflow en cours
gh run watch

# Ou sur GitHub
# Actions → Voir le workflow en cours
```

---

## 📋 Récapitulatif des étapes

1. ✅ Installer GitHub CLI
2. ✅ Exécuter `./setup-secrets.sh`
3. ✅ Entrer vos identifiants DockerHub
4. ✅ Activer les permissions GitHub Actions
5. ✅ Push sur main
6. ✅ GitHub Actions déploie automatiquement !

---

## 🆘 Besoin d'aide ?

- **Documentation complète**: `.github/SECRETS-SETUP.md`
- **Guide complet**: `SETUP-GITHUB-ACTIONS.md`
- **Déploiement**: `DEPLOYMENT.md`

---

## 🎉 C'est tout !

Une fois configuré, chaque `git push` sur `main` déclenchera:
1. Tests automatiques
2. Bump de version
3. Build Docker
4. Push sur DockerHub
5. Release GitHub

**Plus rien à faire manuellement !** 🚀
