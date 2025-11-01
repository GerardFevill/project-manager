#!/bin/bash

echo "🚀 Adding missing endpoints to reach 100% coverage..."

# Update app.module.ts to import new modules
echo "📝 Updating app.module.ts..."

cat > /home/vagrant/project/api/project-manager/src/app.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Core Modules
import { AuthModule } from './modules/auth/Auth.module';
import { UsersModule } from './modules/users/Users.module';
import { TeamsModule } from './modules/teams/Teams.module';

// Project Management
import { ProjectsModule } from './modules/projects/Projects.module';
import { IssuesModule } from './modules/issues/Issues.module';
import { BoardsModule } from './modules/boards/Boards.module';
import { SprintsModule } from './modules/sprints/Sprints.module';
import { RolesModule } from './modules/roles/Roles.module';
import { WorkflowsModule } from './modules/workflows/Workflows.module';

// Issue Features
import { CommentsModule } from './modules/comments/Comments.module';
import { AttachmentsModule } from './modules/attachments/Attachments.module';
import { WatchersModule } from './modules/watchers/Watchers.module';
import { LabelsModule } from './modules/labels/Labels.module';
import { ActivityModule } from './modules/activity/Activity.module';
import { IssueLinksModule } from './modules/issue-links/IssueLinks.module';
import { CustomFieldsModule } from './modules/custom-fields/CustomFields.module';
import { ComponentsModule } from './modules/components/Components.module';
import { VersionsModule } from './modules/versions/Versions.module';

// Phase 2 Modules
import { NotificationsModule } from './modules/notifications/Notifications.module';
import { FiltersModule } from './modules/filters/Filters.module';
import { DashboardsModule } from './modules/dashboards/Dashboards.module';
import { SearchModule } from './modules/search/Search.module';
import { IssueHistoryModule } from './modules/issue-history/IssueHistory.module';
import { WebhooksModule } from './modules/webhooks/Webhooks.module';

// Phase 3 Modules
import { TimeReportsModule } from './modules/time-reports/TimeReports.module';
import { SlaModule } from './modules/sla/Sla.module';
import { AutomationModule } from './modules/automation/Automation.module';
import { AuditLogsModule } from './modules/audit-logs/AuditLogs.module';

// Phase 4 - Portfolio & Strategic
import { PortfoliosModule } from './modules/portfolios/Portfolios.module';
import { ProgramsModule } from './modules/programs/Programs.module';
import { RoadmapsModule } from './modules/roadmaps/Roadmaps.module';
import { InitiativesModule } from './modules/initiatives/Initiatives.module';
import { EpicsModule } from './modules/epics/Epics.module';
import { DependenciesModule } from './modules/dependencies/Dependencies.module';
import { CapacityPlanningModule } from './modules/capacity-planning/CapacityPlanning.module';
import { ResourceAllocationModule } from './modules/resource-allocation/ResourceAllocation.module';

// Phase 5 - Advanced Agile
import { VelocityTrackingModule } from './modules/velocity-tracking/VelocityTracking.module';
import { BurnChartsModule } from './modules/burn-charts/BurnCharts.module';
import { SprintReportsModule } from './modules/sprint-reports/SprintReports.module';
import { RetrospectivesModule } from './modules/retrospectives/Retrospectives.module';
import { ReleaseManagementModule } from './modules/release-management/ReleaseManagement.module';
import { StoryMappingModule } from './modules/story-mapping/StoryMapping.module';
import { CumulativeFlowModule } from './modules/cumulative-flow/CumulativeFlow.module';

// Phase 6 - Finance
import { TimeSheetsModule } from './modules/timesheets/TimeSheets.module';
import { EstimationTemplatesModule } from './modules/estimation-templates/EstimationTemplates.module';
import { BudgetTrackingModule } from './modules/budget-tracking/BudgetTracking.module';
import { InvoicesModule } from './modules/invoices/Invoices.module';
import { CostAnalysisModule } from './modules/cost-analysis/CostAnalysis.module';

// Phase 7 - Configuration
import { FieldConfigurationsModule } from './modules/field-configurations/FieldConfigurations.module';
import { ScreenSchemesModule } from './modules/screen-schemes/ScreenSchemes.module';
import { IssueTypeSchemesModule } from './modules/issue-type-schemes/IssueTypeSchemes.module';
import { FieldContextsModule } from './modules/field-contexts/FieldContexts.module';
import { FormsBuilderModule } from './modules/forms-builder/FormsBuilder.module';
import { WorkflowSchemesModule } from './modules/workflow-schemes/WorkflowSchemes.module';

// Phase 8 - Security
import { PermissionSchemesModule } from './modules/permission-schemes/PermissionSchemes.module';
import { NotificationSchemesModule } from './modules/notification-schemes/NotificationSchemes.module';
import { SecurityLevelsModule } from './modules/security-levels/SecurityLevels.module';
import { DataRetentionModule } from './modules/data-retention/DataRetention.module';
import { GdprComplianceModule } from './modules/gdpr-compliance/GdprCompliance.module';
import { IpWhitelistingModule } from './modules/ip-whitelisting/IpWhitelisting.module';
import { TwoFactorAuthModule } from './modules/two-factor-auth/TwoFactorAuth.module';

// Phase 9 - Integration
import { ApiKeysModule } from './modules/api-keys/ApiKeys.module';
import { OAuthAppsModule } from './modules/oauth-apps/OAuthApps.module';
import { MarketplaceAppsModule } from './modules/marketplace-apps/MarketplaceApps.module';
import { ImportExportModule } from './modules/import-export/ImportExport.module';
import { MigrationToolsModule } from './modules/migration-tools/MigrationTools.module';
import { WebhookTemplatesModule } from './modules/webhook-templates/WebhookTemplates.module';

// Phase 10 - Analytics
import { CustomReportsModule } from './modules/custom-reports/CustomReports.module';
import { ReportTemplatesModule } from './modules/report-templates/ReportTemplates.module';
import { DataWarehouseModule } from './modules/data-warehouse/DataWarehouse.module';
import { AnalyticsEngineModule } from './modules/analytics-engine/AnalyticsEngine.module';
import { KpiTrackingModule } from './modules/kpi-tracking/KpiTracking.module';
import { ExecutiveDashboardsModule } from './modules/executive-dashboards/ExecutiveDashboards.module';

// Phase 11 - Collaboration
import { ConfluenceIntegrationModule } from './modules/confluence-integration/ConfluenceIntegration.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/KnowledgeBase.module';
import { FileStorageModule } from './modules/file-storage/FileStorage.module';
import { MentionsTaggingModule } from './modules/mentions-tagging/MentionsTagging.module';
import { ActivityStreamsModule } from './modules/activity-streams/ActivityStreams.module';
import { TeamChatModule } from './modules/team-chat/TeamChat.module';

// Phase 12 - Service Desk
import { ServiceDeskModule } from './modules/service-desk/ServiceDesk.module';
import { IncidentManagementModule } from './modules/incident-management/IncidentManagement.module';
import { ChangeManagementModule } from './modules/change-management/ChangeManagement.module';
import { AssetManagementModule } from './modules/asset-management/AssetManagement.module';
import { CustomerPortalModule } from './modules/customer-portal/CustomerPortal.module';
import { SlaPoliciesModule } from './modules/sla-policies/SlaPolicies.module';

// Phase 13 - Advanced Features
import { TemplatesLibraryModule } from './modules/templates-library/TemplatesLibrary.module';
import { ProjectCloningModule } from './modules/project-cloning/ProjectCloning.module';
import { BulkOperationsModule } from './modules/bulk-operations/BulkOperations.module';
import { ScheduledJobsModule } from './modules/scheduled-jobs/ScheduledJobs.module';
import { GlobalSettingsModule } from './modules/global-settings/GlobalSettings.module';
import { LocalizationModule } from './modules/localization/Localization.module';
import { MobileApiModule } from './modules/mobile-api/MobileApi.module';

// Phase 14 - AI & Intelligent Features
import { AiSuggestionsModule } from './modules/ai-suggestions/AiSuggestions.module';
import { AutoAssignmentModule } from './modules/auto-assignment/AutoAssignment.module';
import { SentimentAnalysisModule } from './modules/sentiment-analysis/SentimentAnalysis.module';
import { PredictiveAnalyticsModule } from './modules/predictive-analytics/PredictiveAnalytics.module';
import { SmartNotificationsModule } from './modules/smart-notifications/SmartNotifications.module';
import { CodeIntegrationModule } from './modules/code-integration/CodeIntegration.module';

// NEW MODULES - System & Screens
import { SystemModule } from './modules/system/System.module';
import { ScreensModule } from './modules/screens/Screens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // Core
    AuthModule,
    UsersModule,
    TeamsModule,

    // Project Management
    ProjectsModule,
    IssuesModule,
    BoardsModule,
    SprintsModule,
    RolesModule,
    WorkflowsModule,

    // Issue Features
    CommentsModule,
    AttachmentsModule,
    WatchersModule,
    LabelsModule,
    ActivityModule,
    IssueLinksModule,
    CustomFieldsModule,
    ComponentsModule,
    VersionsModule,

    // Phase 2-3
    NotificationsModule,
    FiltersModule,
    DashboardsModule,
    SearchModule,
    IssueHistoryModule,
    WebhooksModule,
    TimeReportsModule,
    SlaModule,
    AutomationModule,
    AuditLogsModule,

    // Phase 4-14
    PortfoliosModule,
    ProgramsModule,
    RoadmapsModule,
    InitiativesModule,
    EpicsModule,
    DependenciesModule,
    CapacityPlanningModule,
    ResourceAllocationModule,
    VelocityTrackingModule,
    BurnChartsModule,
    SprintReportsModule,
    RetrospectivesModule,
    ReleaseManagementModule,
    StoryMappingModule,
    CumulativeFlowModule,
    TimeSheetsModule,
    EstimationTemplatesModule,
    BudgetTrackingModule,
    InvoicesModule,
    CostAnalysisModule,
    FieldConfigurationsModule,
    ScreenSchemesModule,
    IssueTypeSchemesModule,
    FieldContextsModule,
    FormsBuilderModule,
    WorkflowSchemesModule,
    PermissionSchemesModule,
    NotificationSchemesModule,
    SecurityLevelsModule,
    DataRetentionModule,
    GdprComplianceModule,
    IpWhitelistingModule,
    TwoFactorAuthModule,
    ApiKeysModule,
    OAuthAppsModule,
    MarketplaceAppsModule,
    ImportExportModule,
    MigrationToolsModule,
    WebhookTemplatesModule,
    CustomReportsModule,
    ReportTemplatesModule,
    DataWarehouseModule,
    AnalyticsEngineModule,
    KpiTrackingModule,
    ExecutiveDashboardsModule,
    ConfluenceIntegrationModule,
    KnowledgeBaseModule,
    FileStorageModule,
    MentionsTaggingModule,
    ActivityStreamsModule,
    TeamChatModule,
    ServiceDeskModule,
    IncidentManagementModule,
    ChangeManagementModule,
    AssetManagementModule,
    CustomerPortalModule,
    SlaPoliciesModule,
    TemplatesLibraryModule,
    ProjectCloningModule,
    BulkOperationsModule,
    ScheduledJobsModule,
    GlobalSettingsModule,
    LocalizationModule,
    MobileApiModule,
    AiSuggestionsModule,
    AutoAssignmentModule,
    SentimentAnalysisModule,
    PredictiveAnalyticsModule,
    SmartNotificationsModule,
    CodeIntegrationModule,

    // NEW MODULES
    SystemModule,
    ScreensModule,
  ],
})
export class AppModule {}
EOF

echo "✅ App module updated with new modules"
echo "🎉 Script completed! New modules added: System (27 endpoints), Screens (16 endpoints)"
