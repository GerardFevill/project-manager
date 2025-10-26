# Database Migrations avec Liquibase

Ce dossier contient les migrations de base de données gérées par Liquibase.

## Structure

```
database/
├── changelog/
│   └── db.changelog-master.yaml    # Fichier principal qui inclut toutes les migrations
├── migrations/
│   └── 001-create-users-table.yaml # Fichiers de migration individuels (format YAML)
└── drivers/
    └── postgresql.jar              # Driver JDBC PostgreSQL (à télécharger)
```

## Installation du driver JDBC

Téléchargez le driver PostgreSQL JDBC:

```bash
mkdir -p database/drivers
cd database/drivers
wget https://jdbc.postgresql.org/download/postgresql-42.7.1.jar -O postgresql.jar
cd ../..
```

## Commandes Liquibase

```bash
# Appliquer les migrations
npm run migration:update

# Annuler la dernière migration
npm run migration:rollback

# Voir le statut des migrations
npm run migration:status

# Valider les changelogs
npm run migration:validate

# Réinitialiser les checksums
npm run migration:clear-checksums
```

## Créer une nouvelle migration

1. Créez un nouveau fichier YAML dans `database/migrations/`:
   ```bash
   touch database/migrations/002-your-migration-name.yaml
   ```

2. Ajoutez la structure de base:
   ```yaml
   databaseChangeLog:
     - changeSet:
         id: 002-your-migration-name
         author: YourName
         comment: Description de votre migration
         changes:
           # Vos changements ici
           # Exemples:
           # - createTable:
           #     tableName: example
           #     columns:
           #       - column:
           #           name: id
           #           type: uuid

         rollback:
           # Comment annuler les changements
           # - dropTable:
           #     tableName: example
   ```

3. Ajoutez la référence dans `database/changelog/db.changelog-master.yaml`:
   ```yaml
   databaseChangeLog:
     - include:
         file: database/migrations/002-your-migration-name.yaml
         relativeToChangelogFile: false
   ```

## Notes importantes

- **Synchronize TypeORM**: Désactivez `synchronize: false` dans TypeORM (app.module.ts) en production pour utiliser Liquibase
- **ID unique**: Chaque changeSet doit avoir un ID unique
- **Rollback**: Toujours définir un rollback pour pouvoir annuler les migrations
- **Ne pas modifier**: Ne modifiez jamais une migration déjà appliquée en production
