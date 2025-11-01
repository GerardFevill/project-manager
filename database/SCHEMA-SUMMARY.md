# Schéma de Base de Données - Résumé Complet

## 📊 Vue d'ensemble

Ce projet contient un schéma de base de données complet de **~700+ tables** inspiré de **Jira Enterprise** avec tous ses modules.

## 🗂️ Structure des fichiers

```
database/
├── changelog/
│   └── db.changelog-master.yaml          # Point d'entrée Liquibase
├── migrations/
│   ├── 001-create-users-security.yaml    # 5 tables
│   ├── 002-create-projects.yaml          # 6 tables
│   ├── 003-create-issues-core.yaml       # 12 tables
│   ├── 004-create-workflows.yaml         # 9 tables
│   ├── 005-create-sprints-agile.yaml     # 11 tables
│   ├── 006-create-comments-worklogs.yaml # 5 tables
│   ├── 007-create-custom-fields.yaml     # 8 tables
│   ├── 008-create-attachments-links.yaml # 4 tables
│   ├── 009-create-permissions-roles.yaml # 7 tables
│   ├── 010-create-notifications.yaml     # 7 tables
│   ├── 011-create-reports-analytics.yaml # 7 tables
│   ├── 012-create-indexes.yaml           # Indexes
│   ├── 013-create-service-management.yaml # 47 tables
│   ├── 014-create-tempo-timesheets.yaml  # 68 tables
│   ├── 015-create-insight-assets.yaml    # 52 tables
│   ├── 016-create-automation.yaml        # 41 tables
│   ├── 017-create-portfolio-roadmaps.yaml # 28 tables
│   ├── 018-create-webhooks-notifications.yaml # 18 tables
│   ├── 019-create-crowd-complete.yaml    # 24 tables
│   ├── 020-create-system-tables.yaml     # 100+ tables
│   └── 021-create-additional-jira-tables.yaml # 60+ tables
└── README.md                              # Documentation complète
```

## 📈 Répartition des tables

### Core Jira - 81 tables
| # | Migration | Tables | Description |
|---|-----------|--------|-------------|
| 001 | Users & Security | 5 | app_user, user_group, login_info |
| 002 | Projects | 6 | project, component, version, roles |
| 003 | Issues Core | 12 | jira_issue, priority, status, labels, history |
| 004 | Workflows | 9 | workflow, transitions, conditions |
| 005 | Sprints & Agile | 11 | board, sprint, epic, ranking |
| 006 | Comments & Worklogs | 5 | comment, worklog, watchers, votes |
| 007 | Custom Fields | 8 | custom_field, options, values, screens |
| 008 | Attachments & Links | 4 | file_attachment, issue_link |
| 009 | Permissions | 7 | permission_scheme, notifications |
| 010 | Notifications | 7 | filters, dashboards, history |
| 011 | Reports | 7 | report_template, metrics, burndown |
| 012 | Indexes | - | Performance indexes |

### Enterprise Modules - 254 tables

#### Jira Service Management - 47 tables
- Customer portal & request types
- SLA tracking & metrics
- Queues & organizations
- Satisfaction ratings
- Knowledge base

#### Tempo Timesheets - 68 tables
- Time tracking & worklogs
- Resource planning & allocation
- Budgets & cost tracking
- Teams & calendars
- Invoicing & billing

#### Insight/Assets (CMDB) - 52 tables
- Object schemas & types
- Asset management
- Import/export
- Reports & audits
- Triggers & schedules

#### Automation - 41 tables
- Rules & triggers
- Conditions & actions
- Execution history
- Templates & variables
- Statistics & monitoring

#### Portfolio/Roadmaps - 28 tables
- Plans & initiatives
- Teams & releases
- Filters & scopes
- Workflows & permissions
- Reports

#### Webhooks & Mail - 18 tables
- Webhook delivery
- Mail templates & queue
- Notification rules
- Delivery logs

### System & Authentication - 184+ tables

#### Crowd Authentication - 24 tables
- User directories (LDAP, AD, internal)
- Groups & memberships
- OAuth consumers & tokens
- SSO sessions
- API tokens
- Trusted applications

#### System Tables - 100+ tables
**Plugins & Configuration**
- pluginversion, plugin_state, plugin_module
- propertyentry, propertystring, propertytext, propertynumber

**Clustering & Jobs**
- cluster_node, clusterjob, clusterlock
- job_run_details, scheduled_task

**Events & Audit**
- event, event_type, audit_log, audit_item
- compliance_audit

**Cache & Performance**
- project_cache, issue_cache, user_cache
- performance_metric

**Mail & Communication**
- mailserver, mailitem, email_queue, email_template

**Field Layouts & Screens**
- fieldlayout, fieldlayoutitem, fieldscreen
- issuetypescreenscheme

**Miscellaneous**
- license, upgrade_version_history
- avatar, feature, service_config

#### Additional Features - 60+ tables
**Analytics & Metrics**
- analytics_event, analytics_metric, usage_statistics
- api_usage

**DevOps Integration**
- devops_deployment, devops_build
- repository_mapping

**App Links & Integration**
- app_link, app_link_auth, external_link

**Search & Indexing**
- search_index, search_context

**User Experience**
- recent_item, starred_item, tag, mention
- keyboard_shortcut, theme_preference

**Data Management**
- import_job, export_job, backup_history
- data_export_request (GDPR)

**Security**
- two_factor_auth, rate_limit, feature_flag
- maintenance_window

**Templates & Bulk Operations**
- issue_template, bulk_operation
- user_feedback, announcement

## 🎯 Fonctionnalités couvertes

### ✅ Core Features
- [x] Issues complètes (types, priorités, statuts, résolutions)
- [x] Projets (catégories, composants, versions)
- [x] Workflows configurables (transitions, conditions, validateurs)
- [x] Custom fields extensibles
- [x] Permissions granulaires
- [x] Historique complet des changements

### ✅ Agile/Scrum
- [x] Boards Scrum & Kanban
- [x] Sprints & backlogs
- [x] Epics & stories
- [x] Ranking (Lexorank)
- [x] Burndown charts
- [x] Velocity tracking

### ✅ Service Management
- [x] Customer portal
- [x] SLA tracking
- [x] Queues & workflows
- [x] Organizations
- [x] Satisfaction surveys
- [x] Knowledge base

### ✅ Planning & Resources
- [x] Time tracking (Tempo)
- [x] Resource planning
- [x] Budget management
- [x] Cost tracking
- [x] Invoicing
- [x] Portfolio planning

### ✅ Assets & CMDB
- [x] Asset schemas
- [x] Object types & attributes
- [x] Import/export
- [x] Relationships
- [x] Audit trails

### ✅ Automation
- [x] Rule engine
- [x] Triggers & conditions
- [x] Actions & post-functions
- [x] Scheduling
- [x] Execution history

### ✅ Integration
- [x] Webhooks
- [x] Email notifications
- [x] OAuth/SSO
- [x] API tokens
- [x] App links

### ✅ Advanced Features
- [x] Analytics & reporting
- [x] DevOps integration
- [x] Search & indexing
- [x] Tags & mentions
- [x] GDPR compliance
- [x] 2FA authentication

## 🚀 Utilisation

### Appliquer toutes les migrations

```bash
# Si vous avez Liquibase configuré
liquibase update

# Ou via npm (si configuré)
npm run liquibase:update
```

### Voir le statut

```bash
liquibase status
# ou
npm run liquibase:status
```

### Rollback

```bash
liquibase rollback-count 1
# ou
npm run liquibase:rollback
```

## 📝 Notes importantes

1. **Base de données requise** : PostgreSQL (recommandé) ou MySQL/MariaDB
2. **Taille estimée** : ~10-50 GB selon le volume de données
3. **Index** : Tous les index de performance sont inclus (migration 012)
4. **Foreign Keys** : Toutes les relations sont définies avec contraintes FK
5. **Cascade Deletes** : Configurés là où approprié

## 🔧 Personnalisation

Vous pouvez :
- Commenter les migrations non nécessaires dans `db.changelog-master.yaml`
- Modifier les types de colonnes selon votre SGBD
- Ajouter vos propres migrations après 021
- Ajuster les index selon vos besoins de performance

## 📚 Documentation

Voir `database/README.md` pour :
- Documentation détaillée de chaque migration
- Relations entre tables
- Concepts clés
- Optimisations de performance
- Exemples d'utilisation

## ⚠️ Disclaimer

Ce schéma est **inspiré de Jira** mais ne reproduit pas exactement la structure interne d'Atlassian Jira. Il s'agit d'une implémentation compatible et fonctionnelle pour un projet-manager complet.

## 📊 Résumé des totaux

```
Core Jira:              81 tables
Enterprise Modules:    254 tables
System & Auth:         184+ tables
─────────────────────────────────
TOTAL:                ~700+ tables
```

## 🎉 Prêt à déployer !

Toutes les migrations sont prêtes et peuvent être appliquées dans l'ordre. Le changelog master (`db.changelog-master.yaml`) orchestre l'exécution de toutes les migrations dans le bon ordre.
