# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application for project management with a **fractal/hierarchical task system**. The application runs on port 3000 by default.

### Features
- **User Management**: CRUD operations for users
- **Fractal Task System**: Hierarchical to-do list with unlimited nesting
  - Tasks can have sub-tasks (parent-child relationships)
  - Each task can become a project with its own sub-tasks
  - Self-referencing structure for infinite hierarchy
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: PostgreSQL with TypeORM and Liquibase migrations

## Development Commands

```bash
# Install dependencies
npm install

# Database
docker-compose up -d       # Start PostgreSQL database
docker-compose down        # Stop PostgreSQL database
docker-compose logs -f     # View database logs

# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugging enabled

# Building
npm run build              # Compile TypeScript to dist/

# Production
npm run start:prod         # Run compiled application

# Code Quality
npm run lint               # Run ESLint with auto-fix
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:debug         # Run tests with debugger
npm run test:e2e           # Run end-to-end tests

# Database Migrations (Liquibase)
npm run migration:update   # Apply pending migrations
npm run migration:rollback # Rollback last migration
npm run migration:status   # View migration status
npm run migration:validate # Validate changelog files
```

## Architecture

### NestJS Module Structure

The application follows NestJS's modular architecture:

- **Modules**: Organize the application into cohesive blocks of functionality. Each module encapsulates related components.
- **Controllers**: Handle incoming HTTP requests and return responses. Defined with `@Controller()` decorator.
- **Services/Providers**: Contain business logic and are injected into controllers via dependency injection. Defined with `@Injectable()` decorator.
- **Entry Point**: `src/main.ts` bootstraps the application using `NestFactory.create()`.

The root module `AppModule` imports all feature modules and is the starting point for the application graph.

### Testing

- Unit tests: Located alongside source files with `.spec.ts` extension
- E2E tests: Located in `test/` directory with `.e2e-spec.ts` extension
- Jest configuration is in `package.json` with unit tests rooted in `src/` and e2e tests using `test/jest-e2e.json`

## Code Generation

Use NestJS CLI to generate boilerplate:

```bash
nest generate module <name>       # Generate a module
nest generate controller <name>   # Generate a controller
nest generate service <name>      # Generate a service
nest generate resource <name>     # Generate full CRUD resource
```

## TypeScript Configuration

- Target: ES2021
- Module: CommonJS
- Output: `dist/` directory
- Decorators and metadata reflection are enabled for NestJS functionality
- Source maps enabled for debugging

## Database

### PostgreSQL with TypeORM

This project uses TypeORM with PostgreSQL for data persistence.

**Database Configuration:**
- Connection settings are in `.env` file (use `.env.example` as template)
- PostgreSQL runs via Docker Compose on port 5432
- TypeORM auto-sync is enabled in development mode (creates/updates tables automatically)

**Entity Pattern:**
- Entities are defined with TypeORM decorators (e.g., `@Entity()`, `@Column()`)
- Entity files use `.entity.ts` suffix
- Entities are auto-discovered via pattern: `src/**/*.entity{.ts,.js}`

**Example Module Structure:**
```
src/users/
  ├── user.entity.ts       # TypeORM entity definition
  ├── users.module.ts      # NestJS module
  ├── users.service.ts     # Business logic (uses Repository)
  └── users.controller.ts  # HTTP endpoints
```

**Environment Variables:**
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=project_manager
```

**Important Notes:**
- TypeORM `synchronize` is enabled in development but should be disabled in production
- Use migrations for production database schema changes
- The `.env` file is gitignored for security

### Liquibase Migrations

This project uses Liquibase for database schema version control and migrations.

**Migration Files Location:**
- Master changelog: `database/changelog/db.changelog-master.yaml`
- Individual migrations: `database/migrations/XXX-description.yaml` (YAML format)
- Documentation: `database/README.md`

**Setup Required:**
Before running migrations, download the PostgreSQL JDBC driver:
```bash
mkdir -p database/drivers
cd database/drivers
wget https://jdbc.postgresql.org/download/postgresql-42.7.1.jar -O postgresql.jar
```

**Migration Workflow:**
1. Create migration file in `database/migrations/` (YAML format)
2. Add reference in `db.changelog-master.yaml`
3. Run `npm run migration:update` to apply
4. Always include rollback instructions in changesets

**Production Usage:**
- Set TypeORM `synchronize: false` in production
- Use Liquibase for all schema changes
- Never modify applied migrations
- Always test rollback before deploying

## API Endpoints

### Tasks (Fractal To-Do System)

**Base URL:** `/tasks`

#### Create a task
```http
POST /tasks
Content-Type: application/json

{
  "title": "My task",
  "description": "Optional description",
  "dueDate": "2025-12-31",
  "priority": "medium",
  "parentId": "uuid-of-parent-task" // Optional, for sub-tasks
}
```

#### Get all tasks with filters
```http
GET /tasks?status=active&onlyRoot=true&priority=high
```

Query parameters:
- `status`: `all` | `active` | `completed` (default: `all`)
- `priority`: `low` | `medium` | `high` | `urgent`
- `onlyOverdue`: `true` | `false`
- `onlyRoot`: `true` | `false` (only root tasks, no sub-tasks)
- `parentId`: UUID (filter by specific parent)

#### Get task by ID
```http
GET /tasks/:id?includeRelations=true
```

#### Get sub-tasks (children)
```http
GET /tasks/:id/children
```

#### Get full task tree (recursive)
```http
GET /tasks/:id/tree
```

#### Get statistics
```http
GET /tasks/stats
```

Returns:
```json
{
  "total": 42,
  "active": 30,
  "completed": 12,
  "overdue": 5,
  "completionRate": 28
}
```

#### Update a task
```http
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true,
  "parentId": "new-parent-uuid" // Move to different parent
}
```

#### Toggle task completion
```http
PATCH /tasks/:id/toggle
```

#### Delete a task (cascade delete children)
```http
DELETE /tasks/:id
```

### Users

**Base URL:** `/users`

```http
GET    /users           # List all users
GET    /users/:id       # Get user by ID
POST   /users           # Create user
PATCH  /users/:id       # Update user
DELETE /users/:id       # Delete user
```

## Fractal Task System Architecture

### Hierarchy Levels
- **Level 0**: Root tasks (projects)
- **Level 1**: Sub-tasks of projects
- **Level 2**: Sub-tasks of sub-tasks
- **Level N**: Infinite nesting

### Key Concepts

1. **Self-Referencing Entity**
   - Each task can be a parent to other tasks
   - Each task (except roots) has exactly one parent
   - Cascade delete: deleting a parent deletes all children

2. **Automatic Level Calculation**
   - Level is calculated based on parent's level + 1
   - Root tasks (no parent) are level 0
   - Moving a task recalculates all descendant levels

3. **Cyclic Reference Prevention**
   - Service validates that a task cannot be its own ancestor
   - Prevents infinite loops in the hierarchy

4. **Tree Navigation**
   - `GET /tasks/:id/children`: Direct children only
   - `GET /tasks/:id/tree`: Full recursive tree
   - Bi-directional: child->parent and parent->children

### Example Use Cases

**Simple To-Do:**
```
Task (level 0) ← No parent
```

**Project with Sub-tasks:**
```
Project (level 0)
├── Task 1 (level 1)
├── Task 2 (level 1)
└── Task 3 (level 1)
```

**Complex Nested Structure:**
```
Project A (level 0)
├── Phase 1 (level 1)
│   ├── Design (level 2)
│   │   ├── Wireframes (level 3)
│   │   └── Mockups (level 3)
│   └── Development (level 2)
└── Phase 2 (level 1)
```
