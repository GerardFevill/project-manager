# Fonctionnalités et Services Supportés - 700 Tables

## 🎯 CORE JIRA (132 tables)

### 1. Gestion des Utilisateurs et Sécurité
- ✅ Authentification et autorisation
- ✅ Gestion des utilisateurs (app_user)
- ✅ Groupes d'utilisateurs (user_group)
- ✅ Appartenance aux groupes (user_group_membership)
- ✅ Propriétés personnalisées utilisateur (user_property)
- ✅ Historique des connexions (login_info)

### 2. Gestion des Projets
- ✅ Création et gestion de projets
- ✅ Catégories de projets (project_category)
- ✅ Composants de projets (component)
- ✅ Versions/Releases (project_version)
- ✅ Rôles de projet (project_role)
- ✅ Attribution des rôles (project_role_actor)

### 3. Gestion des Issues (Tickets)
- ✅ Création d'issues (jira_issue)
- ✅ Types d'issues (Bug, Story, Task, Epic, Sub-task)
- ✅ Priorités (Highest, High, Medium, Low, Lowest)
- ✅ Statuts (To Do, In Progress, Done, etc.)
- ✅ Résolutions (Fixed, Won't Fix, Duplicate, etc.)
- ✅ Labels pour classification
- ✅ Historique complet des modifications (change_group, change_item)
- ✅ Issues parentes/sous-tâches (hiérarchie)
- ✅ Estimation du temps (time tracking)
- ✅ Dates (création, màj, échéance, résolution)

### 4. Workflows
- ✅ Définition de workflows personnalisés
- ✅ Étapes (workflow_step)
- ✅ Transitions entre étapes
- ✅ Conditions pour les transitions
- ✅ Validateurs de données
- ✅ Post-functions (actions après transition)
- ✅ Schémas de workflow (workflow_scheme)
- ✅ Association workflow ↔ type d'issue

### 5. Agile/Scrum
- ✅ Boards Scrum et Kanban
- ✅ Sprints avec dates de début/fin
- ✅ Backlog
- ✅ Issues dans les sprints (sprint_issue)
- ✅ Colonnes de board personnalisables
- ✅ Mapping colonnes ↔ statuts
- ✅ Swimlanes pour organisation
- ✅ Filtres rapides (quick_filter)
- ✅ Ranking/Ordre des issues (Lexorank)
- ✅ Epics pour regrouper des stories
- ✅ Liens issues ↔ epics

### 6. Collaboration
- ✅ Commentaires sur les issues
- ✅ Mentions (@username)
- ✅ Watchers (surveillance d'issues)
- ✅ Votes sur les issues
- ✅ Notifications par email

### 7. Time Tracking
- ✅ Worklogs (temps passé)
- ✅ Estimation originale
- ✅ Temps restant
- ✅ Attributs personnalisés sur worklogs
- ✅ Configuration time tracking

### 8. Custom Fields
- ✅ Champs personnalisés de tous types
- ✅ Options pour select/multiselect
- ✅ Valeurs des champs custom
- ✅ Configurations de champs
- ✅ Écrans de champs personnalisés
- ✅ Onglets d'écrans
- ✅ Layout des champs

### 9. Pièces Jointes et Liens
- ✅ Upload de fichiers (file_attachment)
- ✅ Types de liens entre issues (blocks, duplicates, relates to)
- ✅ Liens entre issues
- ✅ Liens externes (remote_link)

### 10. Permissions et Sécurité
- ✅ Schémas de permissions
- ✅ Permissions par projet
- ✅ Permissions globales
- ✅ Schémas de notification
- ✅ Règles de notification
- ✅ Association projets ↔ schémas

### 11. Filtres et Dashboards
- ✅ Préférences de notification utilisateur
- ✅ Recherches sauvegardées (JQL)
- ✅ Abonnements aux filtres
- ✅ Partage de filtres/dashboards
- ✅ Historique de navigation
- ✅ Tableaux de bord personnalisés
- ✅ Gadgets dans les dashboards

### 12. Rapports et Analytics
- ✅ Templates de rapports
- ✅ Rapports sauvegardés
- ✅ Statistiques des projets
- ✅ Métriques des sprints
- ✅ Burndown charts
- ✅ Cumulative flow diagrams
- ✅ Velocity tracking

---

## 🏢 ENTERPRISE MODULES (254 tables)

### 13. Jira Service Management (JSM) - 49 tables
- ✅ **Portail Client**
  - Création de demandes par les clients
  - Participation client aux tickets
  - Organisations clients
  - Membres d'organisations

- ✅ **SLA (Service Level Agreements)**
  - Tracking des SLA
  - Buts de SLA (temps de réponse, résolution)
  - Historique des SLA
  - Violations de SLA (breaches)
  - Conditions et exceptions SLA
  - Rapports SLA
  - Calendriers de SLA

- ✅ **Queues de Support**
  - Files d'attente personnalisables
  - Colonnes de queue
  - Filtres de queue
  - Ordre des queues

- ✅ **Types de Demandes**
  - Request types configurables
  - Formulaires de demande
  - Champs personnalisés par type
  - Groupes de types de demande
  - Icônes personnalisées

- ✅ **Gestion des Approbations**
  - Processus d'approbation
  - Historique des approbations
  - Règles d'approbation
  - Configuration des règles
  - Approbateurs multiples

- ✅ **Base de Connaissances**
  - Articles FAQ
  - Knowledge base

- ✅ **Satisfaction Client**
  - Enquêtes de satisfaction
  - Réponses aux enquêtes

- ✅ **Configuration**
  - Configuration Service Desk
  - Configuration projet
  - Logs système

- ✅ **Métriques et Analytics**
  - Métriques de performance
  - Rapports de service

### 14. Tempo Timesheets & Planning - 70 tables
- ✅ **Time Tracking Avancé**
  - Feuilles de temps (timesheet)
  - Entrées de temps détaillées
  - Périodes de temps
  - Approbation des temps
  - Audit des temps
  - Règles de saisie
  - Configuration des règles
  - Paramètres de temps

- ✅ **Gestion Financière**
  - Comptes (accounts)
  - Catégories de comptes
  - Journaux comptables
  - Liens comptables
  - Périodes comptables
  - Transactions
  - Items de transaction

- ✅ **Budgets et Coûts**
  - Budgets projet
  - Coûts projet
  - Tracking des coûts
  - Taux de coût (costrate)
  - Gestion des devises
  - Taux de change

- ✅ **Facturation**
  - Gestion de facturation
  - Factures (invoice)
  - Items de facture
  - Paiements

- ✅ **Planning de Ressources**
  - Plans de ressources
  - Allocation de ressources
  - Planning de ressources (resource_plan)
  - Calendriers de travail
  - Horaires de ressources
  - Équipes de ressources
  - Charge de travail (workload)

- ✅ **Capacité**
  - Gestion de capacité
  - Calendriers personnalisés
  - Jours de travail
  - Semaines de travail
  - Périodes de travail

- ✅ **Équipes**
  - Gestion d'équipes (team)
  - Membres d'équipe
  - Permissions d'équipe
  - Équipes utilisateur

- ✅ **Rôles et Revenus**
  - Rôles projet
  - Rôles de ressources
  - Revenus
  - Salaires

- ✅ **Plans et Templates**
  - Plans de projet
  - Items de plan
  - Templates de plan
  - Items de template
  - Vues de plan

- ✅ **Rapports**
  - Rapports personnalisés
  - Configuration de rapports
  - Templates de rapports

- ✅ **Attributs de Worklog**
  - Attributs personnalisés
  - Valeurs d'attributs

- ✅ **Préférences**
  - Préférences utilisateur

### 15. Insight/Assets (CMDB) - 50 tables
- ✅ **Gestion d'Assets**
  - Objets (assets)
  - Valeurs d'attributs d'objets
  - Types d'objets
  - Attributs de types

- ✅ **Schémas**
  - Schémas d'objets (objectschema)
  - Audit des schémas
  - Permissions de schémas
  - Rôles de schémas

- ✅ **Attributs**
  - Définition d'attributs
  - Types d'attributs

- ✅ **Import/Export**
  - Configuration d'import
  - Historique d'import
  - Logs d'import
  - Sources d'import
  - Configuration d'export
  - Historique d'export
  - Logs d'export

- ✅ **Indexation**
  - Index de recherche
  - Entrées d'index
  - Champs indexés
  - Logs d'indexation

- ✅ **Jobs et Scheduling**
  - Jobs planifiés
  - Historique de jobs
  - Scheduling
  - Historique de scheduling

- ✅ **Scripts et Automation**
  - Scripts personnalisés
  - Logs de scripts
  - Triggers
  - Historique de triggers

- ✅ **Attachements**
  - Pièces jointes aux assets
  - Liens de pièces jointes
  - Permissions sur attachements

- ✅ **Références et Relations**
  - Références entre objets

- ✅ **Rapports**
  - Rapports personnalisés
  - Filtres de rapports
  - Résultats de rapports

- ✅ **Permissions**
  - Gestion des permissions
  - Rôles
  - Assignations de rôles
  - Groupes de rôles
  - Permissions de rôles
  - Utilisateurs par rôle

- ✅ **Statuts**
  - Statuts d'objets
  - Catégories de statuts

- ✅ **Audit**
  - Audit complet
  - Entrées d'audit
  - Logs d'audit

- ✅ **Configuration**
  - Configuration générale
  - Items de configuration

### 16. Automation for Jira - 41 tables
- ✅ **Règles d'Automation**
  - Règles (rule)
  - Audit des règles
  - Détails d'audit
  - Historique des règles
  - Statistiques de règles
  - Agrégations de stats
  - Historique de stats

- ✅ **Actions**
  - Actions de règles

- ✅ **Conditions**
  - Conditions de règles

- ✅ **Triggers**
  - Événements déclencheurs
  - Historique de triggers
  - Logs de triggers

- ✅ **Exécution**
  - Exécution de règles
  - Files d'exécution
  - Verrous d'exécution
  - Logs d'exécution

- ✅ **Scheduling**
  - Planification (cron)
  - Scheduling de règles

- ✅ **Scripts**
  - Scripts personnalisés
  - Logs de scripts

- ✅ **Fonctions**
  - Fonctions personnalisées
  - Paramètres de fonctions

- ✅ **Variables**
  - Variables de règles
  - Types de variables
  - Valeurs de variables

- ✅ **Environnement**
  - Environnements d'exécution
  - Paramètres d'environnement

- ✅ **Templates**
  - Templates de règles
  - Items de templates
  - Paramètres de templates
  - Portée de templates

- ✅ **Erreurs et Monitoring**
  - Gestion d'erreurs
  - Verrous de règles
  - Files d'attente

- ✅ **Projets**
  - Règles par projet
  - Portée de projet
  - Portée de workflow

### 17. Portfolio/Advanced Roadmaps - 28 tables
- ✅ **Plans**
  - Plans de portfolio
  - Audit des plans
  - Items de plan
  - Liens entre items
  - Permissions de plans

- ✅ **Calendriers et Releases**
  - Calendriers de plans
  - Releases
  - Vues de releases

- ✅ **Équipes**
  - Équipes de plan
  - Vues d'équipes

- ✅ **Filtres**
  - Filtres de plans
  - Items de filtres

- ✅ **Rapports**
  - Rapports de plans
  - Filtres de rapports
  - Items de rapports

- ✅ **Rôles**
  - Rôles de plans

- ✅ **Règles**
  - Règles de plans
  - Items de règles

- ✅ **Portée**
  - Portée de plans
  - Items de portée
  - Vues de portée

- ✅ **Configuration**
  - Paramètres de plans

- ✅ **Sprints**
  - Sprints dans plans

- ✅ **Vues**
  - Vues personnalisées
  - Paramètres de vues

- ✅ **Workflows**
  - Workflows de plans
  - Règles de workflow
  - Étapes de workflow

### 18. Webhooks & Notifications - 18 tables
- ✅ **Webhooks**
  - Configuration de webhooks
  - Livraison de webhooks
  - Erreurs de livraison
  - Logs de livraison
  - Requêtes webhook
  - Réponses webhook

- ✅ **Mail Avancé**
  - Historique de mails
  - Logs de mails
  - Notifications mail
  - Erreurs de notifications
  - Logs de notifications
  - Règles de mail
  - Paramètres de règles
  - Configuration mail
  - Erreurs mail
  - File d'attente mail
  - Templates de mail
  - Paramètres de templates

---

## ⚙️ SYSTEM & AUTHENTICATION (160 tables)

### 19. Crowd Authentication - 24 tables
- ✅ **User Directories**
  - Annuaires (LDAP, Active Directory, Internal)
  - Attributs d'annuaires
  - Opérations d'annuaires
  - Mapping d'annuaires

- ✅ **Utilisateurs et Groupes**
  - Utilisateurs Crowd (cwd_user)
  - Adresses utilisateurs
  - Attributs utilisateurs
  - Groupes Crowd (cwd_group)
  - Appartenances (membership)
  - Appartenances utilisateur-groupe

- ✅ **OAuth et SSO**
  - Consommateurs OAuth
  - Tokens de consommateur OAuth
  - Consommateurs OAuth Service Provider
  - Tokens OAuth SP
  - Sessions SSO (sso_session)

- ✅ **API Tokens**
  - Tokens d'API (api_token)
  - Utilisation d'API (api_usage)

- ✅ **Applications de Confiance**
  - Applications de confiance (trusted_app)
  - Applications de confiance legacy (trustedapp)

- ✅ **Authentification 2FA**
  - Two-factor authentication (two_factor_auth)

- ✅ **Tokens de Session**
  - Remember me tokens
  - Audit des remember me tokens

### 20. System Tables - 83 tables
- ✅ **Plugins**
  - Versions de plugins (pluginversion)
  - État des plugins (plugin_state)
  - Modules de plugins (plugin_module)

- ✅ **Propriétés Système**
  - Entrées de propriétés (propertyentry)
  - Propriétés string (propertystring)
  - Propriétés text (propertytext)
  - Propriétés number (propertynumber)
  - Propriétés date (propertydate)
  - Propriétés decimal (propertydecimal)

- ✅ **Clustering**
  - Nœuds de cluster (cluster_node)
  - Jobs de cluster (clusterjob, clusteredjob)
  - Verrous de cluster (clusterlock)
  - Statut de verrous (clusterlockstatus)
  - Messages de cluster (clustermessage)

- ✅ **Jobs Planifiés**
  - Détails d'exécution de jobs
  - Tâches planifiées (scheduled_task)

- ✅ **Événements et Audit**
  - Événements système (event)
  - Types d'événements (event_type)
  - Logs d'audit (audit_log)
  - Items d'audit (audit_item)
  - Audit de conformité (compliance_audit)
  - Valeurs changées dans audit (audit_changed_value)

- ✅ **Cache et Performance**
  - Cache de projets (project_cache)
  - Cache d'issues (issue_cache)
  - Cache d'utilisateurs (user_cache)
  - Cache de résolutions (resolution_cache)
  - Métriques de performance (performance_metric)

- ✅ **Mail et Communication**
  - Serveurs de mail (mailserver)
  - Items de mail (mailitem)
  - File d'attente email (email_queue)
  - Templates email (email_template)

- ✅ **Field Layouts et Screens**
  - Layouts de champs (fieldlayout)
  - Items de layout (fieldlayoutitem)
  - Schémas de layout (fieldlayoutscheme)
  - Associations de schémas (fieldlayoutschemeassociation)
  - Écrans de champs (fieldscreen)
  - Schémas d'écrans (fieldscreenscheme)
  - Items de schémas (fieldscreenschemeitem)
  - Schémas de types d'issues (issuetypescreenscheme)
  - Entités de schémas (issuetypescreenschemeentity)

- ✅ **Configuration**
  - Configuration générique (genericconfiguration)
  - Configuration de schéma (schema_config)
  - Items de configuration managée (managed_configuration_item)
  - Préférences de locale (locale_preference)
  - Configuration de timezone (timezone_config)

- ✅ **Listeners et Filtres**
  - Configuration de listeners (listenerconfig)
  - Filtres de user picker (userpickerfilter)
  - Groupes de filtres (userpickerfiltergroup)
  - Rôles de filtres (userpickerfilterrole)

- ✅ **Recherche et Indexation**
  - File d'indexation (indexqueue)
  - Contexte de recherche (search_context)
  - Index de recherche (search_index)

- ✅ **Issues Supprimées et Déplacées**
  - Issues supprimées (deleted_issue)
  - Clés d'issues déplacées (moved_issue_key)

- ✅ **Schémas de Sécurité**
  - Schémas de sécurité d'issues
  - Niveaux de sécurité
  - Schémas de priorités (priorityscheme)

- ✅ **Associations et Liens**
  - Associations de nœuds (nodeassociation)
  - Favoris (favourite_associations)
  - Liens externes (external_link)
  - Entités externes (external_entity)
  - Liens d'entités (external_entity_link)

- ✅ **Portail et UI**
  - Pages de portail (portalpage)
  - Configuration de portlets (portletconfiguration)

- ✅ **Versioning et Contrôle**
  - Contrôle de version (versioncontrol)
  - Historique de version d'upgrade (upgradeversionhistory)

- ✅ **Layout de Colonnes**
  - Layout de colonnes (columnlayout)
  - Items de layout (columnlayoutitem)

- ✅ **Actions Jira**
  - Actions système (jiraaction)

- ✅ **Licenses**
  - Gestion de licenses (license)

- ✅ **Avatars et Apparence**
  - Avatars (avatar)

- ✅ **Features**
  - Features système (feature)

- ✅ **Services**
  - Configuration de services (service_config)

- ✅ **Trackbacks**
  - Trackbacks (trackback)

- ✅ **Séquences**
  - Valeurs de séquence (sequence_value_item)

- ✅ **Moteur d'Entités**
  - Entity Engine (entity_engine)

- ✅ **Sessions**
  - Informations de session (sessioninformation)

- ✅ **User Base**
  - Base utilisateur (userbase)

### 21. Additional Features - 53 tables
- ✅ **Analytics et Métriques**
  - Événements analytics (analytics_event)
  - Métriques analytics (analytics_metric)
  - Statistiques d'utilisation (usage_statistics)
  - Utilisation d'API (api_usage)

- ✅ **DevOps Integration**
  - Déploiements DevOps (devops_deployment)
  - Builds DevOps (devops_build)
  - Mapping de dépôts (repository_mapping)

- ✅ **App Links et Intégration**
  - Liens d'applications (app_link)
  - Authentification app link (app_link_auth)
  - Propriétés d'applications (app_property)

- ✅ **Recherche et Indexation**
  - Index de recherche (search_index)
  - Contexte de recherche (search_context)

- ✅ **Expérience Utilisateur**
  - Items récents (recent_item)
  - Items favoris (starred_item)
  - Tags (tag)
  - Associations de tags (tag_association)
  - Mentions (mention)
  - Raccourcis clavier (keyboard_shortcut)
  - Préférences de thème (theme_preference)

- ✅ **Gestion de Données**
  - Jobs d'import (import_job)
  - Jobs d'export (export_job)
  - Historique de backup (backup_history)
  - Configuration de backup (backup_config)
  - Requêtes d'export de données GDPR (data_export_request)

- ✅ **Sécurité**
  - Authentification 2FA (two_factor_auth)
  - Limitation de débit (rate_limit)
  - Feature flags (feature_flag)
  - Fenêtres de maintenance (maintenance_window)

- ✅ **Templates et Opérations Bulk**
  - Templates d'issues (issue_template)
  - Opérations en masse (bulk_operation)
  - Feedback utilisateur (user_feedback)
  - Annonces (announcement)

- ✅ **Historique et Filtres**
  - Items d'historique utilisateur (user_history_item)
  - Filtres sauvegardés (saved_quick_filter)
  - Rapports sauvegardés (saved_report)

- ✅ **Replication**
  - File de réplication (replicationqueue)

- ✅ **Whitelist**
  - Whitelist de sécurité (whitelist)

- ✅ **Logs et Erreurs**
  - Logs d'erreurs (error_log)

- ✅ **Formulaires Verrouillés**
  - Formulaires verrouillés (locked_forms)

- ✅ **Sessions de Debug**
  - Sessions de debug (debug_session)

- ✅ **Santé et Monitoring**
  - Checks de santé (health_check)

- ✅ **Workflows Brouillon**
  - Workflows brouillons (draft_workflow)

- ✅ **Swimlanes**
  - Swimlanes de boards (swimlane)

- ✅ **Groupes de Watchers**
  - Groupes de surveillance (watcher_group)

- ✅ **Politiques de Rétention**
  - Politiques de rétention (retention_policy)

- ✅ **Notifications Push**
  - Notifications push mobiles (push_notification)

- ✅ **Abonnements**
  - Abonnements (subscription)
  - Filtres d'abonnement (subscriptionfilter)

---

## 🔌 POPULAR PLUGINS (187 tables)

### 22. ScriptRunner - 32 tables
- ✅ **Scripts Groovy**
  - Registre de scripts
  - Paramètres de scripts
  - Historique d'exécution
  - Métadonnées de scripts

- ✅ **Script Listeners**
  - Listeners d'événements
  - Scripts conditionnels

- ✅ **Script Fields**
  - Champs custom scriptés
  - Templates de champs

- ✅ **Fonctions JQL**
  - Fonctions JQL personnalisées

- ✅ **Script Fragments**
  - Fragments d'interface
  - Positionnement de fragments

- ✅ **REST Endpoints**
  - Endpoints REST personnalisés
  - Logs d'exécution REST
  - Authentification endpoints

- ✅ **Jobs Planifiés**
  - Jobs cron personnalisés
  - Historique d'exécution

- ✅ **Console de Scripts**
  - Historique de console
  - Exécution ad-hoc

- ✅ **Enhanced Search**
  - Recherches améliorées

- ✅ **Workflow Automation**
  - Validateurs scriptés
  - Conditions scriptées
  - Post-functions scriptées

- ✅ **Behaviours**
  - Comportements personnalisés
  - Champs de comportements

- ✅ **Escalation Service**
  - Services d'escalation
  - Exécution d'escalations

- ✅ **Scripts Intégrés**
  - Bibliothèque de scripts

- ✅ **Script Links**
  - Liens personnalisés

- ✅ **Mail Handlers**
  - Gestionnaires d'emails scriptés

- ✅ **Services**
  - Services personnalisés

- ✅ **Fast-Track Transitions**
  - Transitions rapides

- ✅ **Bindings**
  - Bindings de scripts
  - Bindings globaux

- ✅ **Types d'Événements**
  - Événements personnalisés

- ✅ **Ressources**
  - Ressources de scripts

- ✅ **Audit**
  - Logs d'audit de scripts

- ✅ **Permissions**
  - Permissions de scripts

### 23. Big Picture/Structure - 28 tables
- ✅ **Hiérarchies de Projets**
  - Définitions de hiérarchies
  - Niveaux de hiérarchie
  - Nœuds de structure

- ✅ **Gantt Charts**
  - Configuration Gantt
  - Baselines (points de référence)
  - Snapshots de baseline

- ✅ **Dépendances**
  - Dépendances entre issues
  - Types de dépendances
  - Délais (lag)

- ✅ **Ressources**
  - Gestion de ressources
  - Allocation de ressources

- ✅ **Milestones**
  - Jalons de projet

- ✅ **Vues**
  - Vues personnalisées
  - Filtres de vues
  - Colonnes personnalisées

- ✅ **Formules**
  - Formules calculées
  - Rollup configurations

- ✅ **Workload**
  - Schémas de charge de travail

- ✅ **Partage**
  - Permissions de partage

- ✅ **Export**
  - Templates d'export

- ✅ **Automation**
  - Règles d'automation

- ✅ **Timeline**
  - Marqueurs de timeline

- ✅ **Snapshots**
  - Snapshots de portfolio

- ✅ **Risques**
  - Registre de risques

- ✅ **Mapping de Champs**
  - Mapping de champs personnalisés

- ✅ **Calendriers**
  - Calendriers de travail
  - Jours fériés

- ✅ **Préférences**
  - Préférences utilisateur

- ✅ **Logs**
  - Logs d'activité

- ✅ **Synchronisation**
  - Configuration de sync

### 24. Zephyr Test Management - 34 tables
- ✅ **Test Cases**
  - Cas de test
  - Étapes de test

- ✅ **Test Cycles**
  - Cycles de test
  - Folders de tests

- ✅ **Exécutions**
  - Exécutions de tests
  - Résultats d'étapes
  - Défauts liés

- ✅ **Test Plans**
  - Plans de test
  - Cycles dans plans

- ✅ **Attachements**
  - Pièces jointes de tests

- ✅ **Métriques**
  - Métriques de tests

- ✅ **Requirements**
  - Exigences
  - Couverture de tests

- ✅ **Paramètres**
  - Paramètres de tests
  - Jeux de données

- ✅ **Environnements**
  - Environnements de test

- ✅ **Automation**
  - Tests automatisés
  - Résultats d'automation

- ✅ **Rapports**
  - Rapports de tests

- ✅ **Labels**
  - Labels de tests

- ✅ **Custom Fields**
  - Champs personnalisés
  - Valeurs de champs

- ✅ **Test Suites**
  - Suites de tests
  - Cas dans suites

- ✅ **Preconditions**
  - Préconditions
  - Liens préconditions-tests

- ✅ **Repositories**
  - Dépôts de tests

- ✅ **Import/Export**
  - Historique d'import

- ✅ **Templates**
  - Templates de tests

- ✅ **Permissions**
  - Permissions de tests

- ✅ **Configuration**
  - Configuration de tests

- ✅ **Historique**
  - Historique d'exécution

- ✅ **Audit**
  - Audit de tests

- ✅ **Activité**
  - Logs d'activité

### 25. Xray Test Management - 32 tables
- ✅ **Tests Xray**
  - Tests (Manual, Cucumber, Generic)
  - Types de tests
  - Définitions Gherkin

- ✅ **Étapes Manuelles**
  - Étapes de tests manuels
  - Tests appelés

- ✅ **Test Sets**
  - Ensembles de tests
  - Tests dans sets

- ✅ **Exécutions**
  - Exécutions de tests
  - Runs de tests
  - Résultats d'étapes

- ✅ **Test Plans**
  - Plans de test
  - Tests dans plans

- ✅ **Environnements**
  - Environnements de test
  - Environnements par run

- ✅ **Préconditions**
  - Préconditions
  - Tests avec préconditions

- ✅ **Requirements**
  - Exigences
  - Couverture (requirements-tests)

- ✅ **Cucumber/BDD**
  - Scénarios Cucumber
  - Définitions Gherkin
  - Features Cucumber

- ✅ **Test Data**
  - Données de test
  - Données génériques

- ✅ **Repository**
  - Folders de repository
  - Items de repository

- ✅ **Items d'Exécution**
  - Items d'exécution

- ✅ **Import/Export**
  - Configuration d'import
  - Configuration d'export

- ✅ **Settings**
  - Paramètres par projet

- ✅ **Templates**
  - Templates d'exécution

- ✅ **Custom Fields**
  - Champs personnalisés
  - Valeurs de champs

- ✅ **Versions**
  - Versions de tests

- ✅ **Labels**
  - Labels de tests

- ✅ **Priorités**
  - Priorités de tests

### 26. ProForma Forms - 23 tables
- ✅ **Formulaires**
  - Formulaires personnalisés
  - Versions de formulaires

- ✅ **Questions**
  - Questions de formulaire
  - Types de questions variés
  - Sections de formulaire
  - Choix de réponses

- ✅ **Réponses**
  - Réponses de formulaire
  - Réponses aux questions

- ✅ **Règles**
  - Règles de formulaire
  - Règles de validation

- ✅ **Templates**
  - Templates de formulaires

- ✅ **Permissions**
  - Permissions de formulaires

- ✅ **Workflow**
  - Mapping workflow

- ✅ **Calculs**
  - Calculs de formulaire
  - Formules

- ✅ **Attachements**
  - Pièces jointes de formulaires

- ✅ **Conditions**
  - Logique conditionnelle

- ✅ **Audit**
  - Logs d'audit de formulaires

- ✅ **Rapports**
  - Rapports de formulaires

- ✅ **Notifications**
  - Notifications de formulaires

- ✅ **Signatures**
  - Signatures numériques

- ✅ **Settings**
  - Paramètres de formulaires

- ✅ **Export**
  - Configuration d'export

- ✅ **Analytics**
  - Analytics de formulaires

- ✅ **Préférences**
  - Préférences utilisateur

### 27. Integration Plugins - 19 tables
- ✅ **Confluence**
  - Pages Confluence
  - Liens Confluence
  - Spaces Confluence

- ✅ **Bitbucket**
  - Dépôts Bitbucket
  - Commits Bitbucket
  - Pull Requests

- ✅ **GitHub**
  - Dépôts GitHub
  - Commits GitHub

- ✅ **GitLab**
  - Projets GitLab

- ✅ **Slack**
  - Channels Slack
  - Notifications Slack

- ✅ **Microsoft Teams**
  - Channels Teams

- ✅ **Zendesk**
  - Tickets Zendesk

- ✅ **Salesforce**
  - Cases Salesforce

- ✅ **Draw.io**
  - Diagrammes Draw.io

- ✅ **Lucidchart**
  - Documents Lucidchart

- ✅ **Time in Status**
  - Temps dans chaque statut

- ✅ **Advanced Roadmaps**
  - Vues de roadmap supplémentaires

- ✅ **Email This Issue**
  - Logs d'envoi d'emails

### 28. Extended System - 19 tables
- ✅ **Cache Avancé**
  - Cache de requêtes
  - Cache de sessions
  - Nœuds de cache distribué

- ✅ **Monitoring de Performance**
  - Logs de performance
  - Checks de santé
  - Métriques de requêtes

- ✅ **Database Connection Pool**
  - Pool de connexions DB

- ✅ **Error Tracking**
  - Tracking d'erreurs

- ✅ **Feature Flags**
  - Historique de feature flags

- ✅ **Rate Limiting**
  - Buckets de rate limit
  - Logs de rate limit API

- ✅ **Background Jobs**
  - File de jobs en arrière-plan
  - Retry queue pour webhooks

- ✅ **Geo Location**
  - Cache de géolocalisation

- ✅ **Email**
  - Logs de bounce d'emails

- ✅ **Security Audit**
  - Audit de sécurité étendu

- ✅ **License Tracking**
  - Tracking d'utilisation de licenses

- ✅ **Async Tasks**
  - Résultats de tâches asynchrones

- ✅ **Data Retention**
  - Politiques de rétention de données

---

## 🤖 ADVANCED FEATURES (17 tables)

### 29. AI/ML & Advanced Analytics - 17 tables
- ✅ **Machine Learning**
  - Modèles de prédiction ML
  - Prédictions d'issues par AI
  - Suggestions intelligentes

- ✅ **GDPR Extended**
  - Sujets de données GDPR
  - Requêtes d'accès GDPR

- ✅ **Analytics Avancées**
  - Dashboards analytics
  - Widgets analytics
  - Analytics prédictive

- ✅ **Sentiment Analysis**
  - Analyse de sentiment

- ✅ **Métriques d'Équipe**
  - Métriques de collaboration d'équipe

- ✅ **Knowledge Base**
  - Articles de base de connaissances
  - Feedback sur articles

- ✅ **Chatbot**
  - Conversations de chatbot
  - Messages de chatbot

- ✅ **Capacity Planning**
  - Planning de capacité de ressources

- ✅ **Code Quality**
  - Métriques de qualité de code

- ✅ **Blockchain**
  - Audit trail blockchain (sécurité avancée)

---

## 📊 RÉSUMÉ DES SERVICES

### Catégories de Services:

1. **Gestion de Projet**: 132 tables
2. **Service Desk/Support**: 49 tables
3. **Time & Resource Management**: 70 tables
4. **Asset Management (CMDB)**: 50 tables
5. **Automation**: 41 tables
6. **Portfolio Planning**: 28 tables
7. **Communications**: 18 tables
8. **Test Management**: 66 tables (Zephyr + Xray)
9. **Forms & Workflows**: 23 tables
10. **Integrations**: 19 tables
11. **Scripting & Customization**: 32 tables
12. **Visualization**: 28 tables
13. **System & Security**: 160 tables
14. **AI/ML & Analytics**: 17 tables

### **TOTAL: 700 TABLES = PLATEFORME COMPLÈTE**

---

## 🎯 Cas d'Usage Supportés

### Pour les Équipes de Développement
- Gestion complète du cycle de vie du développement
- Scrum/Kanban/Agile
- CI/CD avec intégrations DevOps
- Code quality tracking
- Test management complet

### Pour le Service Desk
- Support client multi-canal
- SLA tracking automatique
- Base de connaissances
- Satisfaction client

### Pour la Gestion de Projet
- Portfolio planning
- Resource management
- Budget & cost tracking
- Roadmaps visuels

### Pour la Conformité
- GDPR compliance
- Audit trails complets
- Blockchain security
- Retention policies

### Pour l'IT
- Asset management (CMDB)
- Change management
- Incident management
- Configuration management

### Pour l'Analytique
- Dashboards personnalisés
- Predictive analytics
- ML-powered insights
- Real-time metrics

---

**Ces 700 tables supportent une plateforme complète de gestion de projet, service desk, et asset management de niveau Enterprise!** 🚀
