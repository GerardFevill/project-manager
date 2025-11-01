# Jira Enterprise API - NestJS

API REST complète pour Jira Enterprise avec 700 tables.

## 🚀 Fonctionnalités

### ✅ Core Modules Implémentés
- **Auth & Users** - Authentification JWT, gestion utilisateurs
- **Projects** - Gestion de projets (à venir)
- **Issues** - Tracking d'issues (à venir)
- **Workflows** - Gestion de workflows (à venir)
- **Boards** - Boards Agile (à venir)
- **Sprints** - Gestion de sprints (à venir)

### 📊 Database Schema
- **700 tables** Jira Enterprise Complete
- **29 migrations** Liquibase
- **153 foreign keys**
- **52 index** de performance

## 🛠️ Technologies

- **NestJS** 10.x - Framework Node.js
- **TypeORM** 0.3.x - ORM
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Swagger** - Documentation API
- **Class Validator** - Validation

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier les variables d'environnement
nano .env
```

## 🗄️ Base de Données

### Appliquer les migrations Liquibase

```bash
# Si vous avez Liquibase installé
liquibase update

# Ou via Docker
docker run --rm -v $(pwd)/database:/liquibase/changelog \
  liquibase/liquibase \
  --url=jdbc:postgresql://localhost:5432/jira_enterprise \
  --username=postgres \
  --password=postgres \
  --changeLogFile=changelog/db.changelog-master.yaml \
  update
```

### Structure du schéma

Voir `database/README.md` pour la documentation complète du schéma.

## 🚀 Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod

# Mode debug
npm run start:debug
```

L'API sera disponible sur `http://localhost:3000/api/v1`

## 📚 Documentation API

Une fois l'application démarrée, accédez à la documentation Swagger:

```
http://localhost:3000/api/docs
```

## 🏗️ Architecture

```
src/
├── config/               # Configuration (DB, etc.)
├── common/              # Utilitaires communs
│   ├── decorators/      # Décorateurs personnalisés
│   ├── guards/          # Guards (Auth, Roles)
│   ├── interceptors/    # Intercepteurs
│   └── pipes/           # Pipes de validation
├── modules/             # Modules fonctionnels
│   ├── auth/           # Authentification
│   ├── users/          # Gestion utilisateurs
│   ├── projects/       # Gestion projets
│   ├── issues/         # Tracking issues
│   ├── workflows/      # Gestion workflows
│   ├── boards/         # Boards Agile
│   └── sprints/        # Gestion sprints
└── main.ts             # Point d'entrée
```

## 🔐 Authentification

L'API utilise JWT pour l'authentification. Pour obtenir un token:

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

Utilisez ensuite le token dans le header:

```
Authorization: Bearer <votre_token>
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## 📝 Variables d'Environnement

Voir `.env.example` pour la liste complète des variables:

```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=jira_enterprise

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
```

## 🎯 Endpoints Principaux

### Authentification
- `POST /api/v1/auth/register` - Inscription
- `POST /api/v1/auth/login` - Connexion
- `POST /api/v1/auth/refresh` - Rafraîchir le token
- `GET /api/v1/auth/me` - Profil utilisateur

### Users (à venir)
- `GET /api/v1/users` - Liste des utilisateurs
- `GET /api/v1/users/:id` - Détails utilisateur
- `POST /api/v1/users` - Créer utilisateur
- `PUT /api/v1/users/:id` - Modifier utilisateur
- `DELETE /api/v1/users/:id` - Supprimer utilisateur

### Projects (à venir)
- `GET /api/v1/projects` - Liste des projets
- `GET /api/v1/projects/:id` - Détails projet
- `POST /api/v1/projects` - Créer projet
- `PUT /api/v1/projects/:id` - Modifier projet
- `DELETE /api/v1/projects/:id` - Supprimer projet

### Issues (à venir)
- `GET /api/v1/issues` - Liste des issues
- `GET /api/v1/issues/:id` - Détails issue
- `POST /api/v1/issues` - Créer issue
- `PUT /api/v1/issues/:id` - Modifier issue
- `DELETE /api/v1/issues/:id` - Supprimer issue

## 📈 Roadmap

### Phase 1 - Core (En cours)
- [x] Configuration de base
- [x] Module Database
- [ ] Module Auth complet
- [ ] Module Users CRUD
- [ ] Module Projects CRUD
- [ ] Module Issues CRUD

### Phase 2 - Agile
- [ ] Module Workflows
- [ ] Module Boards
- [ ] Module Sprints
- [ ] Module Epics

### Phase 3 - Enterprise
- [ ] Module Service Management (JSM)
- [ ] Module Tempo
- [ ] Module Automation
- [ ] Module Webhooks

### Phase 4 - Plugins
- [ ] Module Test Management
- [ ] Module Forms
- [ ] Module Portfolio

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'feat: add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 License

MIT

## 👥 Auteurs

Project Manager Team

---

**Status**: 🚧 En développement actif
**Version**: 1.0.0
**Database Tables**: 700
**Modules**: 8 (dont 2 implémentés)
