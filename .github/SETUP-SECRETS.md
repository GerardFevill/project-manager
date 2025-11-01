# GitHub Secrets Setup Guide

Pour que les workflows GitHub Actions fonctionnent correctement, vous devez configurer les secrets suivants dans votre repository GitHub.

## Configuration des Secrets

### 1. Accéder aux Secrets GitHub

1. Allez sur votre repository GitHub: https://github.com/GerardFevill/project-manager
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**

### 2. Secrets Requis

#### DOCKER_USERNAME
- **Nom**: `DOCKER_USERNAME`
- **Valeur**: `gerard.nouglozeh@protonmail.com`
- **Description**: Votre nom d'utilisateur Docker Hub

#### DOCKER_PASSWORD
- **Nom**: `DOCKER_PASSWORD`
- **Valeur**: Votre token Docker Hub (à créer sur https://hub.docker.com/settings/security)
- **Description**: Token d'accès Docker Hub (recommandé) ou mot de passe

## Création d'un Token Docker Hub (Recommandé)

Pour des raisons de sécurité, il est fortement recommandé d'utiliser un token d'accès au lieu de votre mot de passe:

1. Connectez-vous à Docker Hub: https://hub.docker.com
2. Allez dans **Account Settings** → **Security**
3. Cliquez sur **New Access Token**
4. Donnez un nom au token (ex: "GitHub Actions CI/CD")
5. Sélectionnez les permissions: **Read, Write, Delete**
6. Cliquez sur **Generate**
7. **IMPORTANT**: Copiez le token immédiatement (il ne sera plus affiché)
8. Utilisez ce token comme valeur pour `DOCKER_PASSWORD`

## Vérification

Une fois les secrets configurés, vérifiez que:

1. ✅ Les secrets apparaissent dans la liste (la valeur sera masquée)
2. ✅ Les workflows GitHub Actions peuvent accéder aux secrets
3. ✅ Testez en faisant un push sur la branche `feat-jira-full`

## Workflows Configurés

Les workflows suivants utiliseront ces secrets:

- **docker-build-push.yml**: Build et push automatique vers Docker Hub
- **ci.yml**: Tests et linting
- **release.yml**: Création de releases avec tags

## Commandes pour Tester

```bash
# Faire un push pour déclencher le CI/CD
git add .
git commit -m "test: trigger CI/CD pipeline"
git push origin feat-jira-full

# Créer une release (tag)
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

## Sécurité

⚠️ **NE JAMAIS** committer vos credentials dans le code
⚠️ Révoquez immédiatement tout token exposé
⚠️ Utilisez des tokens avec permissions minimales

## Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans l'onglet **Actions** de votre repository
2. Assurez-vous que les secrets sont bien configurés
3. Vérifiez que le token Docker Hub a les bonnes permissions
