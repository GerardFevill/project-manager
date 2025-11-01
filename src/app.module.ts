import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';

// Core
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeamsModule } from './modules/teams/teams.module';

// Project Management
import { ProjectsModule } from './modules/projects/projects.module';
import { ComponentsModule } from './modules/components/components.module';
import { VersionsModule } from './modules/versions/versions.module';
import { IssuesModule } from './modules/issues/issues.module';
import { IssueLinksModule } from './modules/issue-links/issue-links.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { BoardsModule } from './modules/boards/boards.module';
import { SprintsModule } from './modules/sprints/sprints.module';

// Issue Features
import { CommentsModule } from './modules/comments/comments.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { WatchersModule } from './modules/watchers/watchers.module';
import { LabelsModule } from './modules/labels/labels.module';
import { ActivityModule } from './modules/activity/activity.module';
import { IssueHistoryModule } from './modules/issue-history/issue-history.module';
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module';

// Security & Access Control
import { RolesModule } from './modules/roles/roles.module';

// Notifications & Communication
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EmailModule } from './modules/email/email.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

// Search & Filters
import { SearchModule } from './modules/search/search.module';
import { FiltersModule } from './modules/filters/filters.module';
import { DashboardsModule } from './modules/dashboards/dashboards.module';

// Advanced Features (Phases 2-3)
import { SLAModule } from './modules/sla/sla.module';
import { AutomationModule } from './modules/automation/automation.module';
import { TimeReportsModule } from './modules/time-reports/time-reports.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

// Phase 4 - Portfolio & Strategic
import { PortfoliosModule } from './modules/portfolios/portfolios.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { RoadmapsModule } from './modules/roadmaps/roadmaps.module';
import { InitiativesModule } from './modules/initiatives/initiatives.module';
import { EpicsModule } from './modules/epics/epics.module';
import { DependenciesModule } from './modules/dependencies/dependencies.module';
import { CapacityPlanningModule } from './modules/capacity-planning/capacity-planning.module';
import { ResourceAllocationModule } from './modules/resource-allocation/resource-allocation.module';

// Phase 5 - Advanced Agile
import { VelocityTrackingModule } from './modules/velocity-tracking/velocity-tracking.module';
import { BurnChartsModule } from './modules/burn-charts/burn-charts.module';
import { SprintReportsModule } from './modules/sprint-reports/sprint-reports.module';
import { RetrospectivesModule } from './modules/retrospectives/retrospectives.module';
import { ReleaseManagementModule } from './modules/release-management/release-management.module';
import { StoryMappingModule } from './modules/story-mapping/story-mapping.module';
import { CumulativeFlowModule } from './modules/cumulative-flow/cumulative-flow.module';

// Phase 6 - Finance
import { TimeSheetsModule } from './modules/timesheets/timesheets.module';
import { EstimationTemplatesModule } from './modules/estimation-templates/estimation-templates.module';
import { BudgetTrackingModule } from './modules/budget-tracking/budget-tracking.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { CostAnalysisModule } from './modules/cost-analysis/cost-analysis.module';

// Phase 7 - Configuration
import { FieldConfigurationsModule } from './modules/field-configurations/field-configurations.module';
import { ScreenSchemesModule } from './modules/screen-schemes/screen-schemes.module';
import { IssueTypeSchemesModule } from './modules/issue-type-schemes/issue-type-schemes.module';
import { FieldContextsModule } from './modules/field-contexts/field-contexts.module';
import { FormsBuilderModule } from './modules/forms-builder/forms-builder.module';
import { WorkflowSchemesModule } from './modules/workflow-schemes/workflow-schemes.module';

// Phase 8 - Security
import { PermissionSchemesModule } from './modules/permission-schemes/permission-schemes.module';
import { NotificationSchemesModule } from './modules/notification-schemes/notification-schemes.module';
import { SecurityLevelsModule } from './modules/security-levels/security-levels.module';
import { DataRetentionModule } from './modules/data-retention/data-retention.module';
import { GdprComplianceModule } from './modules/gdpr-compliance/gdpr-compliance.module';
import { IpWhitelistingModule } from './modules/ip-whitelisting/ip-whitelisting.module';
import { TwoFactorAuthModule } from './modules/two-factor-auth/two-factor-auth.module';

// Phase 9 - Integration
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { OAuthAppsModule } from './modules/oauth-apps/oauth-apps.module';
import { MarketplaceAppsModule } from './modules/marketplace-apps/marketplace-apps.module';
import { ImportExportModule } from './modules/import-export/import-export.module';
import { MigrationToolsModule } from './modules/migration-tools/migration-tools.module';
import { WebhookTemplatesModule } from './modules/webhook-templates/webhook-templates.module';

// Phase 10 - Analytics
import { CustomReportsModule } from './modules/custom-reports/custom-reports.module';
import { ReportTemplatesModule } from './modules/report-templates/report-templates.module';
import { DataWarehouseModule } from './modules/data-warehouse/data-warehouse.module';
import { AnalyticsEngineModule } from './modules/analytics-engine/analytics-engine.module';
import { KpiTrackingModule } from './modules/kpi-tracking/kpi-tracking.module';
import { ExecutiveDashboardsModule } from './modules/executive-dashboards/executive-dashboards.module';

// Phase 11 - Collaboration
import { ConfluenceIntegrationModule } from './modules/confluence-integration/confluence-integration.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { MentionsTaggingModule } from './modules/mentions-tagging/mentions-tagging.module';
import { ActivityStreamsModule } from './modules/activity-streams/activity-streams.module';
import { TeamChatModule } from './modules/team-chat/team-chat.module';

// Phase 12 - Service Desk
import { ServiceDeskModule } from './modules/service-desk/service-desk.module';
import { IncidentManagementModule } from './modules/incident-management/incident-management.module';
import { ChangeManagementModule } from './modules/change-management/change-management.module';
import { AssetManagementModule } from './modules/asset-management/asset-management.module';
import { CustomerPortalModule } from './modules/customer-portal/customer-portal.module';
import { SlaPoliciesModule } from './modules/sla-policies/sla-policies.module';

// Phase 13 - Advanced Features
import { TemplatesLibraryModule } from './modules/templates-library/templates-library.module';
import { ProjectCloningModule } from './modules/project-cloning/project-cloning.module';
import { BulkOperationsModule } from './modules/bulk-operations/bulk-operations.module';
import { ScheduledJobsModule } from './modules/scheduled-jobs/scheduled-jobs.module';
import { GlobalSettingsModule } from './modules/global-settings/global-settings.module';
import { LocalizationModule } from './modules/localization/localization.module';
import { MobileApiModule } from './modules/mobile-api/mobile-api.module';

// Phase 14 - AI & Automation
import { AiSuggestionsModule } from './modules/ai-suggestions/ai-suggestions.module';
import { AutoAssignmentModule } from './modules/auto-assignment/auto-assignment.module';
import { SentimentAnalysisModule } from './modules/sentiment-analysis/sentiment-analysis.module';
import { PredictiveAnalyticsModule } from './modules/predictive-analytics/predictive-analytics.module';
import { SmartNotificationsModule } from './modules/smart-notifications/smart-notifications.module';
import { CodeIntegrationModule } from './modules/code-integration/code-integration.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),

    // Core Modules
    AuthModule,
    UsersModule,
    TeamsModule,

    // Project Management
    ProjectsModule,
    ComponentsModule,
    VersionsModule,
    IssuesModule,
    IssueLinksModule,
    WorkflowsModule,
    BoardsModule,
    SprintsModule,

    // Issue Features
    CommentsModule,
    AttachmentsModule,
    WatchersModule,
    LabelsModule,
    ActivityModule,
    IssueHistoryModule,
    CustomFieldsModule,

    // Security & Access Control
    RolesModule,

    // Notifications & Communication
    NotificationsModule,
    EmailModule,
    WebhooksModule,

    // Search & Filters
    SearchModule,
    FiltersModule,
    DashboardsModule,

    // Advanced Features (Phase 2-3)
    SLAModule,
    AutomationModule,
    TimeReportsModule,
    AuditLogsModule,

    // Phase 4 - Portfolio & Strategic
    PortfoliosModule,
    ProgramsModule,
    RoadmapsModule,
    InitiativesModule,
    EpicsModule,
    DependenciesModule,
    CapacityPlanningModule,
    ResourceAllocationModule,

    // Phase 5 - Advanced Agile
    VelocityTrackingModule,
    BurnChartsModule,
    SprintReportsModule,
    RetrospectivesModule,
    ReleaseManagementModule,
    StoryMappingModule,
    CumulativeFlowModule,

    // Phase 6 - Finance
    TimeSheetsModule,
    EstimationTemplatesModule,
    BudgetTrackingModule,
    InvoicesModule,
    CostAnalysisModule,

    // Phase 7 - Configuration
    FieldConfigurationsModule,
    ScreenSchemesModule,
    IssueTypeSchemesModule,
    FieldContextsModule,
    FormsBuilderModule,
    WorkflowSchemesModule,

    // Phase 8 - Security
    PermissionSchemesModule,
    NotificationSchemesModule,
    SecurityLevelsModule,
    DataRetentionModule,
    GdprComplianceModule,
    IpWhitelistingModule,
    TwoFactorAuthModule,

    // Phase 9 - Integration
    ApiKeysModule,
    OAuthAppsModule,
    MarketplaceAppsModule,
    ImportExportModule,
    MigrationToolsModule,
    WebhookTemplatesModule,

    // Phase 10 - Analytics
    CustomReportsModule,
    ReportTemplatesModule,
    DataWarehouseModule,
    AnalyticsEngineModule,
    KpiTrackingModule,
    ExecutiveDashboardsModule,

    // Phase 11 - Collaboration
    ConfluenceIntegrationModule,
    KnowledgeBaseModule,
    FileStorageModule,
    MentionsTaggingModule,
    ActivityStreamsModule,
    TeamChatModule,

    // Phase 12 - Service Desk & ITSM
    ServiceDeskModule,
    IncidentManagementModule,
    ChangeManagementModule,
    AssetManagementModule,
    CustomerPortalModule,
    SlaPoliciesModule,

    // Phase 13 - Advanced Features
    TemplatesLibraryModule,
    ProjectCloningModule,
    BulkOperationsModule,
    ScheduledJobsModule,
    GlobalSettingsModule,
    LocalizationModule,
    MobileApiModule,

    // Phase 14 - AI & Intelligent Automation
    AiSuggestionsModule,
    AutoAssignmentModule,
    SentimentAnalysisModule,
    PredictiveAnalyticsModule,
    SmartNotificationsModule,
    CodeIntegrationModule,
  ],
})
export class AppModule {}
