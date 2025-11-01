import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

/**
 * Migration pour créer les tables relationnelles manquantes
 * Identifiées dans PROJECT_COMPLETENESS_ANALYSIS.md
 */
export class CreateRelationalTables1730419200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== USER RELATIONS ====================

    // Table: user_groups (Many-to-Many: Users <-> Groups)
    await queryRunner.createTable(
      new Table({
        name: 'user_groups',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'group_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '50',
            default: "'member'",
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'added_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Index pour user_groups
    await queryRunner.query(
      `CREATE INDEX "IDX_user_groups_user_id" ON "user_groups" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_groups_group_id" ON "user_groups" ("group_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_groups_unique" ON "user_groups" ("user_id", "group_id")`,
    );

    // Table: user_properties (Key-Value properties for users)
    await queryRunner.createTable(
      new Table({
        name: 'user_properties',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'property_key',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'property_value',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Index pour user_properties
    await queryRunner.query(
      `CREATE INDEX "IDX_user_properties_user_id" ON "user_properties" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_properties_unique" ON "user_properties" ("user_id", "property_key")`,
    );

    // Table: user_avatars (Avatar storage for users)
    await queryRunner.createTable(
      new Table({
        name: 'user_avatars',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'avatar_type',
            type: 'varchar',
            length: '50',
            default: "'uploaded'",
          },
          {
            name: 'file_size',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'uploaded_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // ==================== PROJECT RELATIONS ====================

    // Table: project_users (Members of projects)
    await queryRunner.createTable(
      new Table({
        name: 'project_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar',
            length: '100',
            default: "'Developer'",
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'added_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Index pour project_users
    await queryRunner.query(
      `CREATE INDEX "IDX_project_users_project_id" ON "project_users" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_project_users_user_id" ON "project_users" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_project_users_unique" ON "project_users" ("project_id", "user_id")`,
    );

    // Table: project_role_actors (Actors for project roles)
    await queryRunner.createTable(
      new Table({
        name: 'project_role_actors',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'role_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'actor_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'actor_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'user or group',
          },
          {
            name: 'actor_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Index pour project_role_actors
    await queryRunner.query(
      `CREATE INDEX "IDX_project_role_actors_project_id" ON "project_role_actors" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_project_role_actors_role_id" ON "project_role_actors" ("role_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_project_role_actors_actor" ON "project_role_actors" ("actor_id", "actor_type")`,
    );

    // Table: project_features (Enabled features per project)
    await queryRunner.createTable(
      new Table({
        name: 'project_features',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'feature_key',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'enabled',
            type: 'boolean',
            default: true,
          },
          {
            name: 'configuration',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Index pour project_features
    await queryRunner.query(
      `CREATE INDEX "IDX_project_features_project_id" ON "project_features" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_project_features_unique" ON "project_features" ("project_id", "feature_key")`,
    );

    // Table: project_avatars (Avatar storage for projects)
    await queryRunner.createTable(
      new Table({
        name: 'project_avatars',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'avatar_type',
            type: 'varchar',
            length: '50',
            default: "'uploaded'",
          },
          {
            name: 'file_size',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'uploaded_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Table: issue_statistics (Cached statistics for projects/issues)
    await queryRunner.createTable(
      new Table({
        name: 'issue_statistics',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'project_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'total_issues',
            type: 'integer',
            default: 0,
          },
          {
            name: 'open_issues',
            type: 'integer',
            default: 0,
          },
          {
            name: 'in_progress_issues',
            type: 'integer',
            default: 0,
          },
          {
            name: 'resolved_issues',
            type: 'integer',
            default: 0,
          },
          {
            name: 'closed_issues',
            type: 'integer',
            default: 0,
          },
          {
            name: 'average_resolution_time_hours',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'active_users',
            type: 'integer',
            default: 0,
          },
          {
            name: 'last_activity',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'calculated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Foreign Keys will be added if needed based on existing tables
    console.log('Relational tables created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('issue_statistics', true);
    await queryRunner.dropTable('project_avatars', true);
    await queryRunner.dropTable('project_features', true);
    await queryRunner.dropTable('project_role_actors', true);
    await queryRunner.dropTable('project_users', true);
    await queryRunner.dropTable('user_avatars', true);
    await queryRunner.dropTable('user_properties', true);
    await queryRunner.dropTable('user_groups', true);
  }
}
