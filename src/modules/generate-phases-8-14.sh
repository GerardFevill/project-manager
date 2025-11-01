#!/bin/bash

create_entity() {
    cat > "$1/entities/$2.entity.ts" << ENTITY
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('$3')
export class $2 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  config: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
ENTITY

    cat > "$1/$4.module.ts" << MODULE
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { $2 } from './entities/$2.entity';

@Module({
  imports: [TypeOrmModule.forFeature([$2])],
  exports: [TypeOrmModule],
})
export class ${4}Module {}
MODULE
}

# Phase 8 - Security
create_entity "permission-schemes" "PermissionScheme" "permission_schemes" "PermissionSchemes"
create_entity "notification-schemes" "NotificationScheme" "notification_schemes" "NotificationSchemes"
create_entity "security-levels" "SecurityLevel" "security_levels" "SecurityLevels"
create_entity "data-retention" "DataRetention" "data_retention" "DataRetention"
create_entity "gdpr-compliance" "GdprLog" "gdpr_logs" "GdprCompliance"
create_entity "ip-whitelisting" "IpWhitelist" "ip_whitelist" "IpWhitelisting"
create_entity "two-factor-auth" "TwoFactorAuth" "two_factor_auth" "TwoFactorAuth"

# Phase 9 - Integration
create_entity "api-keys" "ApiKey" "api_keys" "ApiKeys"
create_entity "oauth-apps" "OAuthApp" "oauth_apps" "OAuthApps"
create_entity "marketplace-apps" "MarketplaceApp" "marketplace_apps" "MarketplaceApps"
create_entity "import-export" "ImportExport" "import_export_logs" "ImportExport"
create_entity "migration-tools" "Migration" "migrations_log" "MigrationTools"
create_entity "webhook-templates" "WebhookTemplate" "webhook_templates" "WebhookTemplates"

# Phase 10 - Analytics
create_entity "custom-reports" "CustomReport" "custom_reports" "CustomReports"
create_entity "report-templates" "ReportTemplate" "report_templates" "ReportTemplates"
create_entity "data-warehouse" "DataWarehouse" "data_warehouse" "DataWarehouse"
create_entity "analytics-engine" "AnalyticsMetric" "analytics_metrics" "AnalyticsEngine"
create_entity "kpi-tracking" "KpiMetric" "kpi_metrics" "KpiTracking"
create_entity "executive-dashboards" "ExecutiveDashboard" "executive_dashboards" "ExecutiveDashboards"

# Phase 11 - Collaboration
create_entity "confluence-integration" "ConfluencePage" "confluence_pages" "ConfluenceIntegration"
create_entity "knowledge-base" "KnowledgeArticle" "knowledge_articles" "KnowledgeBase"
create_entity "file-storage" "FileStorage" "file_storage" "FileStorage"
create_entity "mentions-tagging" "Mention" "mentions" "MentionsTagging"
create_entity "activity-streams" "ActivityStream" "activity_streams" "ActivityStreams"
create_entity "team-chat" "ChatMessage" "chat_messages" "TeamChat"

# Phase 12 - Service Desk
create_entity "service-desk" "ServiceRequest" "service_requests" "ServiceDesk"
create_entity "incident-management" "Incident" "incidents" "IncidentManagement"
create_entity "change-management" "ChangeRequest" "change_requests" "ChangeManagement"
create_entity "asset-management" "Asset" "assets" "AssetManagement"
create_entity "customer-portal" "CustomerTicket" "customer_tickets" "CustomerPortal"
create_entity "sla-policies" "SlaPolicy" "sla_policies" "SlaPolicies"

# Phase 13 - Advanced Features
create_entity "templates-library" "ProjectTemplate" "project_templates" "TemplatesLibrary"
create_entity "project-cloning" "CloneOperation" "clone_operations" "ProjectCloning"
create_entity "bulk-operations" "BulkOperation" "bulk_operations" "BulkOperations"
create_entity "scheduled-jobs" "ScheduledJob" "scheduled_jobs" "ScheduledJobs"
create_entity "global-settings" "GlobalSetting" "global_settings" "GlobalSettings"
create_entity "localization" "Translation" "translations" "Localization"
create_entity "mobile-api" "MobileSession" "mobile_sessions" "MobileApi"

# Phase 14 - AI & Automation
create_entity "ai-suggestions" "AiSuggestion" "ai_suggestions" "AiSuggestions"
create_entity "auto-assignment" "AssignmentRule" "assignment_rules" "AutoAssignment"
create_entity "sentiment-analysis" "SentimentLog" "sentiment_logs" "SentimentAnalysis"
create_entity "predictive-analytics" "Prediction" "predictions" "PredictiveAnalytics"
create_entity "smart-notifications" "SmartNotification" "smart_notifications" "SmartNotifications"
create_entity "code-integration" "CodeCommit" "code_commits" "CodeIntegration"

echo "All phases 8-14 modules created!"
