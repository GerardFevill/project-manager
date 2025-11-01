# Database Schema Documentation

## Vue d'ensemble

Ce schéma de base de données est inspiré de Jira et fournit une structure complète pour un système de gestion de projet de type Agile/Scrum.

## Structure des migrations Liquibase

Les migrations sont organisées de manière modulaire dans le dossier `migrations/` :

### 001 - Users & Security
Tables pour la gestion des utilisateurs, groupes et authentification :
- `app_user` : Utilisateurs de l'application
- `user_group` : Groupes d'utilisateurs
- `user_group_membership` : Liaison utilisateurs-groupes
- `user_property` : Propriétés personnalisées des utilisateurs
- `login_info` : Historique des connexions

### 002 - Projects
Structure des projets et organisation :
- `project_category` : Catégories de projets
- `project` : Projets principaux
- `component` : Composants au sein des projets
- `project_version` : Versions/releases
- `project_role` : Rôles dans les projets
- `project_role_actor` : Attribution des rôles

### 003 - Issues Core
Système de tickets/issues principal :
- `priority` : Niveaux de priorité
- `resolution` : Types de résolution
- `issue_type` : Types d'issues (Bug, Story, Task, Epic, etc.)
- `status_category` : Catégories de statut (To Do, In Progress, Done)
- `issue_status` : Statuts d'issues
- `jira_issue` : Issues principales
- `issue_component` : Liaison issues-composants
- `issue_version` : Liaison issues-versions (affects/fix)
- `label` : Labels disponibles
- `issue_label` : Liaison issues-labels
- `change_group` : Groupes de modifications
- `change_item` : Historique détaillé des modifications

### 004 - Workflows
Gestion des workflows et transitions :
- `workflow` : Définitions de workflows
- `workflow_scheme` : Schémas de workflow
- `workflow_scheme_entity` : Liaison workflow-type d'issue
- `project_workflow_scheme` : Attribution workflow aux projets
- `workflow_step` : Étapes du workflow
- `workflow_transition` : Transitions entre étapes
- `workflow_condition` : Conditions des transitions
- `workflow_validator` : Validateurs
- `workflow_post_function` : Actions post-transition

### 005 - Sprints & Agile
Fonctionnalités Agile/Scrum :
- `board` : Boards Scrum/Kanban
- `sprint` : Sprints
- `sprint_issue` : Issues dans les sprints
- `board_column` : Colonnes du board
- `board_column_status` : Mapping colonnes-statuts
- `swimlane` : Swimlanes pour organisation
- `quick_filter` : Filtres rapides
- `issue_rank` : Classement des issues (Lexorank)
- `epic` : Epics
- `issue_epic_link` : Liaison issues-epics

### 006 - Comments & Work Logs
Collaboration et suivi du temps :
- `comment` : Commentaires sur les issues
- `worklog` : Temps de travail enregistré
- `worklog_attribute` : Attributs des worklogs
- `issue_watcher` : Surveillance d'issues
- `issue_vote` : Votes sur les issues

### 007 - Custom Fields
Champs personnalisables :
- `custom_field` : Définitions de champs custom
- `custom_field_option` : Options pour select/multiselect
- `custom_field_value` : Valeurs des champs custom
- `field_configuration` : Configurations de champs
- `field_configuration_item` : Items de configuration
- `field_screen` : Écrans de champs
- `field_screen_tab` : Onglets d'écrans
- `field_screen_layout_item` : Layout des écrans

### 008 - Attachments & Links
Pièces jointes et liaisons :
- `file_attachment` : Fichiers attachés
- `issue_link_type` : Types de liens (blocks, duplicates, relates to, etc.)
- `issue_link` : Liens entre issues
- `remote_link` : Liens externes

### 009 - Permissions & Roles
Sécurité et permissions :
- `permission_scheme` : Schémas de permissions
- `scheme_permission` : Permissions dans les schémas
- `project_permission_scheme` : Attribution aux projets
- `global_permission` : Permissions globales
- `notification_scheme` : Schémas de notification
- `notification` : Règles de notification
- `project_notification_scheme` : Attribution notifications aux projets

### 010 - Notifications & Dashboards
Notifications et tableaux de bord :
- `user_notification_preference` : Préférences utilisateur
- `search_request` : Filtres sauvegardés (JQL)
- `filter_subscription` : Abonnements aux filtres
- `share_permission` : Partage de filtres/dashboards
- `user_history_item` : Historique de navigation
- `dashboard` : Tableaux de bord
- `gadget` : Gadgets dans les dashboards

### 011 - Reports & Analytics
Rapports et métriques :
- `report_template` : Templates de rapports
- `saved_report` : Rapports sauvegardés
- `time_tracking_config` : Configuration time tracking
- `project_stats` : Statistiques des projets
- `sprint_metrics` : Métriques des sprints
- `burndown_data` : Données burndown chart
- `cumulative_flow_data` : Données cumulative flow diagram

### 012 - Indexes
Index pour optimisation des performances sur toutes les tables critiques.

## Statistiques du schéma

### Nombre de tables par catégorie :

#### CORE JIRA (81 tables)
| Catégorie | Tables |
|-----------|--------|
| Users & Security | 5 |
| Projects | 6 |
| Issues Core | 12 |
| Workflows | 9 |
| Sprints & Agile | 11 |
| Comments & Worklogs | 5 |
| Custom Fields | 8 |
| Attachments & Links | 4 |
| Permissions & Roles | 7 |
| Notifications & Dashboards | 7 |
| Reports & Analytics | 7 |
| **SUBTOTAL CORE** | **81 tables** |

#### ENTERPRISE MODULES (335 tables)
| Module | Tables |
|--------|--------|
| Service Management (JSM) | 47 |
| Tempo (Timesheets/Planning) | 68 |
| Insight/Assets (CMDB) | 52 |
| Automation for Jira | 41 |
| Portfolio/Roadmaps | 28 |
| Webhooks & Mail | 18 |
| **SUBTOTAL ENTERPRISE** | **254 tables** |

#### AUTHENTICATION & SYSTEM (184+ tables)
| Catégorie | Tables |
|-----------|--------|
| Crowd (Authentication) | 24 |
| System Tables (Plugins, Cache, Jobs) | 100+ |
| Additional Features | 60+ |
| **SUBTOTAL SYSTEM** | **184+ tables** |

### **GRAND TOTAL : ~700+ TABLES**

## Concepts clés

### 1. Issues (Tickets)
- Chaque issue a un `issue_key` unique (ex: PROJ-123)
- Les issues peuvent avoir des sous-tâches (relation parent-child)
- Les issues peuvent être liées entre elles (blocks, duplicates, etc.)
- Support des custom fields pour extension

### 2. Workflows
- Chaque type d'issue peut avoir son propre workflow
- Les workflows définissent les statuts et transitions possibles
- Les transitions peuvent avoir des conditions, validateurs et post-functions

### 3. Agile/Scrum
- Les boards peuvent être Scrum ou Kanban
- Les sprints contiennent des issues
- Support du ranking (Lexorank) pour l'ordre des issues
- Les epics permettent de regrouper des stories

### 4. Time Tracking
- Estimation originale, temps restant, temps passé
- Worklogs détaillés avec date de début et durée
- Configuration flexible (heures/jours)

### 5. Permissions
- Permissions au niveau global
- Permissions au niveau projet (via schemes)
- Permissions au niveau issue (via security levels)
- Support des rôles de projet

### 6. Extensibilité
- Custom fields pour ajouter des champs métier
- Field configurations pour personnaliser les écrans
- Workflows personnalisables
- Rapports paramétrables

## Relations principales

```
project
  ├── jira_issue (1:N)
  ├── component (1:N)
  ├── project_version (1:N)
  ├── board (1:N)
  └── sprint via board (1:N:N)

jira_issue
  ├── comment (1:N)
  ├── worklog (1:N)
  ├── file_attachment (1:N)
  ├── issue_link (N:N via issue_link)
  ├── epic (1:1 si type Epic)
  ├── sprint_issue (N:N)
  └── custom_field_value (1:N)

sprint
  ├── sprint_issue (1:N)
  ├── sprint_metrics (1:1)
  └── burndown_data (1:N snapshots)
```

## Migration et versioning

Les migrations Liquibase sont organisées par fonctionnalité et peuvent être exécutées de manière incrémentale.

### Ordre d'exécution
1. Core tables (users, projects)
2. Issues et types
3. Workflows
4. Agile features
5. Extensions (custom fields, etc.)
6. Reporting
7. Indexes (performance)

### Commandes Liquibase

```bash
# Appliquer toutes les migrations
npm run liquibase:update

# Rollback dernière migration
npm run liquibase:rollback

# Voir le statut
npm run liquibase:status
```

## Notes de performance

### Index critiques créés :
- issue_key (unique, recherche rapide)
- project_id sur issues (filtrage par projet)
- assignee_id, reporter_id (recherche par utilisateur)
- status_id (filtrage par statut)
- created_date, updated_date (tri temporel)
- sprint_id + issue_id (unique composite)

### Optimisations recommandées :
- Partitionnement de `change_item` par date si volume élevé
- Archivage des issues fermées anciennes
- Cache des custom_field_value pour performance
- Dénormalisation des compteurs (votes, watches) si nécessaire

## Liste complète des migrations

### Migrations Core (001-012) - 81 tables
- **001-create-users-security.yaml** : Tables utilisateurs et authentification
- **002-create-projects.yaml** : Projets, composants, versions, rôles
- **003-create-issues-core.yaml** : Issues, types, priorités, statuts, labels, historique
- **004-create-workflows.yaml** : Workflows, transitions, conditions, validateurs
- **005-create-sprints-agile.yaml** : Boards, sprints, epics, ranking
- **006-create-comments-worklogs.yaml** : Commentaires, time tracking, watchers
- **007-create-custom-fields.yaml** : Champs personnalisés et configurations
- **008-create-attachments-links.yaml** : Pièces jointes et liens entre issues
- **009-create-permissions-roles.yaml** : Schémas de permissions et notifications
- **010-create-notifications.yaml** : Préférences, filtres, dashboards
- **011-create-reports-analytics.yaml** : Templates de rapports et métriques
- **012-create-indexes.yaml** : Index de performance

### Migrations Enterprise (013-018) - 254 tables
- **013-create-service-management.yaml** (47 tables) : JSM - SLA, queues, portail client
- **014-create-tempo-timesheets.yaml** (68 tables) : Planning, budgets, ressources, facturation
- **015-create-insight-assets.yaml** (52 tables) : CMDB, objets, schémas, audits
- **016-create-automation.yaml** (41 tables) : Règles d'automatisation, triggers, actions
- **017-create-portfolio-roadmaps.yaml** (28 tables) : Plans, roadmaps, initiatives
- **018-create-webhooks-notifications.yaml** (18 tables) : Webhooks et emails avancés

### Migrations Système (019-021) - 184+ tables
- **019-create-crowd-complete.yaml** (24 tables) : Authentification complète Crowd
- **020-create-system-tables.yaml** (100+ tables) : Plugins, cache, jobs, clustering, propriétés
- **021-create-additional-jira-tables.yaml** (60+ tables) : Fonctionnalités additionnelles

## Compatibilité Jira

Ce schéma est **inspiré de Jira Enterprise Complete** et couvre :

✅ **Core Jira** (issues, projects, workflows)
✅ **Jira Software** (boards, sprints, epics)
✅ **Jira Service Management** (SLA, queues, customer portal)
✅ **Tempo Timesheets/Planner** (time tracking, planning, budgets)
✅ **Insight/Assets** (CMDB, asset management)
✅ **Automation for Jira** (rules, triggers, actions)
✅ **Portfolio/Advanced Roadmaps** (planning, initiatives)
✅ **Webhooks & Notifications** (integrations avancées)
✅ **Crowd Authentication** (SSO, OAuth, API tokens)
✅ **System Management** (plugins, clustering, cache)
✅ **Advanced Features** (analytics, DevOps, integrations)

## Évolutions futures possibles

1. **Service Desk** : Ajout des tables pour customer requests, SLA
2. **Automation** : Tables pour rules, triggers, actions
3. **Portfolio** : Plans, initiatives, capacité
4. **Audit avancé** : Logs détaillés de toutes les actions
5. **Webhooks** : Configuration et historique
6. **API tokens** : Gestion des tokens d'accès
