# Endpoints Manquants - Analyse Détaillée

## Actuel: 544 endpoints
## Cible: 645 endpoints
## Manquant: 101 endpoints

---

## 1️⃣ Issues (~150 endpoints Jira) - Actuels: 8
**Manquants: ~30 endpoints**

### À ajouter:
- POST /issues/bulk (création en masse)
- PUT /issues/bulk (mise à jour en masse)
- POST /issues/{id}/notify (notifier les utilisateurs)
- POST /issues/{id}/assignee (assigner)
- POST /issues/{id}/move (déplacer vers un autre projet)
- POST /issues/{id}/clone (cloner une issue)
- GET /issues/{id}/subtasks
- POST /issues/{id}/subtasks
- GET /issues/{id}/remotelinks
- POST /issues/{id}/remotelinks
- DELETE /issues/{id}/remotelinks/{linkId}
- GET /issues/{id}/editmeta (métadonnées d'édition)
- GET /issues/{id}/createmeta
- GET /issues/createmeta (métadonnées globales)
- GET /issues/picker/suggestions
- POST /issues/{id}/archive
- POST /issues/{id}/restore

---

## 2️⃣ Projects (~80 endpoints Jira) - Actuels: 8
**Manquants: ~25 endpoints**

### À ajouter:
- GET /projects/{id}/users (utilisateurs du projet)
- GET /projects/{id}/roles/{roleId}/actors
- POST /projects/{id}/roles/{roleId}/actors
- DELETE /projects/{id}/roles/{roleId}/actors/{actorId}
- GET /projects/{id}/issuesecuritylevelscheme
- GET /projects/{id}/notificationscheme
- GET /projects/{id}/permissionscheme
- GET /projects/{id}/features
- PUT /projects/{id}/features
- GET /projects/search (recherche avancée)
- GET /projects/{id}/avatar
- POST /projects/{id}/avatar
- GET /projects/{id}/hierarchy
- GET /projects/{id}/insights
- GET /projects/{id}/validate

---

## 3️⃣ Users & Groups (~60 endpoints Jira) - Actuels: 5
**Manquants: ~20 endpoints**

### À ajouter:
- GET /users/search/query
- GET /users/search/assignable/multiProjectSearch
- GET /users/picker
- GET /users/{id}/groups
- GET /users/{id}/permissions
- GET /users/{id}/properties
- PUT /users/{id}/properties/{key}
- DELETE /users/{id}/properties/{key}
- GET /users/{id}/avatar
- POST /users/{id}/avatar
- GET /groups/search
- GET /groups/picker
- GET /groups/{id}/users
- POST /groups/bulk
- DELETE /groups/bulk

---

## 4️⃣ Workflows (~40 endpoints Jira) - Actuels: 5
**Manquants: ~10 endpoints**

### À ajouter:
- GET /workflows/{id}/transitions
- PUT /workflows/{id}/transitions/{transitionId}
- POST /workflows/{id}/publish
- GET /workflows/{id}/draft
- POST /workflows/{id}/draft
- PUT /workflows/{id}/properties
- GET /workflows/schemes/projects
- POST /workflows/transitions/rules

---

## 5️⃣ Fields & Screens (~80 endpoints Jira) - Actuels: 11 (custom-fields)
**Manquants: ~15 endpoints**

### À ajouter un module "screens":
- GET /screens
- POST /screens
- GET /screens/{id}
- PUT /screens/{id}
- DELETE /screens/{id}
- GET /screens/{id}/availableFields
- GET /screens/{id}/tabs/{tabId}/fields/all
- POST /screens/addToDefault/{fieldId}

---

## 6️⃣ Permissions & Roles (~50 endpoints Jira) - Actuels: 10
**Manquants: ~5 endpoints**

### À ajouter:
- GET /permissions/project/{projectId}
- POST /permissions/check
- GET /mypermissions

---

## 7️⃣ System / Server Info (~25 endpoints Jira) - Actuels: 0
**MANQUANTS: ~25 endpoints** ⚠️

### À ajouter un module "system":
- GET /serverInfo
- GET /configuration
- GET /configuration/timetracking
- PUT /configuration/timetracking
- GET /configuration/timetracking/list
- GET /applicationrole
- GET /applicationrole/{key}
- GET /application-properties
- GET /application-properties/advanced-settings
- PUT /application-properties/{id}
- GET /settings/columns
- PUT /settings/columns
- GET /priority
- POST /priority
- GET /priority/{id}
- PUT /priority/{id}
- DELETE /priority/{id}
- GET /resolution
- GET /issuetype
- POST /issuetype
- GET /issuetype/{id}
- PUT /issuetype/{id}
- DELETE /issuetype/{id}
- GET /status
- POST /status

---

## 8️⃣ Autres améliorations nécessaires

### Enhance existing controllers:
- **Search**: Ajouter /search/jql, /search/users, /search/projects
- **Comments**: Endpoints déjà bons
- **Attachments**: Endpoints déjà bons
- **Issue Links**: Ajouter types de liens
- **Watchers**: Endpoints déjà bons
- **Workflows**: Plus de endpoints de transition
- **Webhooks**: Ajouter plus de logs et statistiques

---

## Priorités d'implémentation:

1. **CRITIQUE**: System/Server Info (0/25) - Module complètement manquant
2. **IMPORTANT**: Issues - Compléter CRUD avancé (bulk, move, clone, etc.)
3. **IMPORTANT**: Projects - Ajouter gestion des utilisateurs et rôles
4. **MOYEN**: Users/Groups - Compléter recherche et properties
5. **MOYEN**: Screens - Créer le module manquant
6. **FAIBLE**: Workflows - Compléter transitions
7. **FAIBLE**: Fields - Quelques endpoints manquants

---

## Total à implémenter: ~101 endpoints
