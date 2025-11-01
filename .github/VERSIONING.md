# 📦 Versioning Automatique

Ce projet utilise le versioning automatique basé sur les **Conventional Commits**.

## 🎯 Comment ça marche ?

À chaque commit sur les branches `main`, `master` ou `feat-jira-full`, la version est automatiquement incrémentée selon le type de commit :

### Types de commits et incrémentation

| Type de commit | Incrémentation | Exemple |
|----------------|----------------|---------|
| `feat:` | **MINOR** (0.X.0) | `feat: add user authentication` → 1.1.0 |
| `fix:` | **PATCH** (0.0.X) | `fix: resolve login bug` → 1.0.1 |
| `perf:` | **PATCH** (0.0.X) | `perf: optimize database queries` → 1.0.1 |
| `refactor:` | **PATCH** (0.0.X) | `refactor: restructure auth module` → 1.0.1 |
| `docs:` | **PATCH** (0.0.X) | `docs: update API documentation` → 1.0.1 |
| `style:` | **PATCH** (0.0.X) | `style: format code` → 1.0.1 |
| `test:` | **PATCH** (0.0.X) | `test: add unit tests` → 1.0.1 |
| `chore:` | **PATCH** (0.0.X) | `chore: update dependencies` → 1.0.1 |
| `ci:` | **PATCH** (0.0.X) | `ci: update workflow` → 1.0.1 |
| `BREAKING CHANGE:` | **MAJOR** (X.0.0) | `feat!: redesign API` → 2.0.0 |
| `feat!:` | **MAJOR** (X.0.0) | `feat!: remove deprecated endpoints` → 2.0.0 |

## 📝 Exemples de commits

### Feature (MINOR bump)
```bash
git commit -m "feat: add password reset functionality"
# 1.0.0 → 1.1.0
```

### Bug fix (PATCH bump)
```bash
git commit -m "fix: correct email validation regex"
# 1.1.0 → 1.1.1
```

### Breaking change (MAJOR bump)
```bash
git commit -m "feat!: change authentication to OAuth2"
# 1.1.1 → 2.0.0
```

### Multiple changes
```bash
git commit -m "feat: add export feature

- Export to PDF
- Export to Excel
- Add export history"
# 2.0.0 → 2.1.0
```

## 🚀 Workflow

1. **Vous faites un commit** avec un message conventionnel
2. **GitHub Actions détecte** le type de commit
3. **Version automatiquement incrémentée** dans `package.json`
4. **Tag Git créé** automatiquement (ex: `v1.2.3`)
5. **Docker image buildée et pushée** avec le nouveau tag
6. **GitHub Release créée** automatiquement

## 🛑 Skip versioning

Pour éviter l'incrémentation de version sur certains commits :

```bash
git commit -m "docs: update README [skip version]"
git commit -m "chore: update dependencies [skip ci]"
```

## 📊 Semantic Versioning (SemVer)

Version format : `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles (breaking changes)
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

### Exemples
- `1.0.0` → Version initiale
- `1.1.0` → Ajout de fonctionnalité
- `1.1.1` → Correction de bug
- `2.0.0` → Changement majeur incompatible

## 🐳 Images Docker

Chaque version est disponible sur Docker Hub :

```bash
# Version spécifique
docker pull gerard.nouglozeh/jira-enterprise-api:v1.2.3

# Dernière version
docker pull gerard.nouglozeh/jira-enterprise-api:latest

# Par branche
docker pull gerard.nouglozeh/jira-enterprise-api:feat-jira-full
```

## 📦 Vérifier la version actuelle

```bash
# Localement
node -p "require('./package.json').version"

# Dernière release GitHub
gh release view

# Tags Git
git tag -l "v*"
```

## 🔧 Configuration

Les workflows de versioning sont dans :
- `.github/workflows/version-on-commit.yml` - Versioning automatique
- `.github/workflows/release.yml` - Publication de releases

## 📚 Ressources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
