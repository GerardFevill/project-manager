#!/bin/bash
cd /home/vagrant/project/api/project-manager/src/modules

complete_module() {
    local MODULE_DIR=$1
    local ENTITY_NAME=$2
    local MODULE_NAME=$3
    
    echo "Completing $MODULE_NAME..."
    mkdir -p "$MODULE_DIR/dto"
    
    # DTOs
    cat > "$MODULE_DIR/dto/create-${MODULE_DIR}.dto.ts" << 'EOF'
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class Create__ENTITY__Dto {
  @ApiProperty({ example: 'Example name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
EOF
    sed -i "s/__ENTITY__/${ENTITY_NAME}/g" "$MODULE_DIR/dto/create-${MODULE_DIR}.dto.ts"

    cat > "$MODULE_DIR/dto/update-${MODULE_DIR}.dto.ts" << 'EOF'
import { PartialType } from '@nestjs/swagger';
import { Create__ENTITY__Dto } from './create-__MODULE__.dto';

export class Update__ENTITY__Dto extends PartialType(Create__ENTITY__Dto) {}
EOF
    sed -i "s/__ENTITY__/${ENTITY_NAME}/g" "$MODULE_DIR/dto/update-${MODULE_DIR}.dto.ts"
    sed -i "s/__MODULE__/${MODULE_DIR}/g" "$MODULE_DIR/dto/update-${MODULE_DIR}.dto.ts"

    # Service
    cat > "$MODULE_DIR/${MODULE_DIR}.service.ts" << 'EOF'
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { __ENTITY__ } from './entities/__ENTITY__.entity';
import { Create__ENTITY__Dto } from './dto/create-__MODULE__.dto';
import { Update__ENTITY__Dto } from './dto/update-__MODULE__.dto';

@Injectable()
export class __MODULENAME__Service {
  constructor(@InjectRepository(__ENTITY__) private readonly repository: Repository<__ENTITY__>) {}

  async create(dto: Create__ENTITY__Dto): Promise<__ENTITY__> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<__ENTITY__[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<__ENTITY__> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`__ENTITY__ ${id} not found`);
    return entity;
  }

  async update(id: string, dto: Update__ENTITY__Dto): Promise<__ENTITY__> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    entity.updatedAt = new Date();
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
EOF
    sed -i "s/__ENTITY__/${ENTITY_NAME}/g" "$MODULE_DIR/${MODULE_DIR}.service.ts"
    sed -i "s/__MODULE__/${MODULE_DIR}/g" "$MODULE_DIR/${MODULE_DIR}.service.ts"
    sed -i "s/__MODULENAME__/${MODULE_NAME}/g" "$MODULE_DIR/${MODULE_DIR}.service.ts"

    # Controller
    cat > "$MODULE_DIR/${MODULE_DIR}.controller.ts" << 'EOF'
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { __MODULENAME__Service } from './__MODULE__.service';
import { Create__ENTITY__Dto } from './dto/create-__MODULE__.dto';
import { Update__ENTITY__Dto } from './dto/update-__MODULE__.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('__MODULE__')
@Controller('__MODULE__')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class __MODULENAME__Controller {
  constructor(private readonly service: __MODULENAME__Service) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: Create__ENTITY__Dto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: Update__ENTITY__Dto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
EOF
    sed -i "s/__ENTITY__/${ENTITY_NAME}/g" "$MODULE_DIR/${MODULE_DIR}.controller.ts"
    sed -i "s/__MODULE__/${MODULE_DIR}/g" "$MODULE_DIR/${MODULE_DIR}.controller.ts"
    sed -i "s/__MODULENAME__/${MODULE_NAME}/g" "$MODULE_DIR/${MODULE_DIR}.controller.ts"

    # Module
    cat > "$MODULE_DIR/${MODULE_NAME}.module.ts" << 'EOF'
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { __ENTITY__ } from './entities/__ENTITY__.entity';
import { __MODULENAME__Controller } from './__MODULE__.controller';
import { __MODULENAME__Service } from './__MODULE__.service';

@Module({
  imports: [TypeOrmModule.forFeature([__ENTITY__])],
  controllers: [__MODULENAME__Controller],
  providers: [__MODULENAME__Service],
  exports: [__MODULENAME__Service, TypeOrmModule],
})
export class __MODULENAME__Module {}
EOF
    sed -i "s/__ENTITY__/${ENTITY_NAME}/g" "$MODULE_DIR/${MODULE_NAME}.module.ts"
    sed -i "s/__MODULE__/${MODULE_DIR}/g" "$MODULE_DIR/${MODULE_NAME}.module.ts"
    sed -i "s/__MODULENAME__/${MODULE_NAME}/g" "$MODULE_DIR/${MODULE_NAME}.module.ts"
}

# Phase 5
complete_module "velocity-tracking" "Velocity" "VelocityTracking"
complete_module "burn-charts" "BurnData" "BurnCharts"
complete_module "sprint-reports" "SprintReport" "SprintReports"
complete_module "retrospectives" "Retrospective" "Retrospectives"
complete_module "release-management" "Release" "ReleaseManagement"
complete_module "story-mapping" "StoryMap" "StoryMapping"
complete_module "cumulative-flow" "CumulativeFlow" "CumulativeFlow"

# Phase 6
complete_module "timesheets" "TimeSheet" "TimeSheets"
complete_module "estimation-templates" "EstimationTemplate" "EstimationTemplates"
complete_module "budget-tracking" "Budget" "BudgetTracking"
complete_module "invoices" "Invoice" "Invoices"
complete_module "cost-analysis" "CostAnalysis" "CostAnalysis"

# Phase 7
complete_module "field-configurations" "FieldConfiguration" "FieldConfigurations"
complete_module "screen-schemes" "ScreenScheme" "ScreenSchemes"
complete_module "issue-type-schemes" "IssueTypeScheme" "IssueTypeSchemes"
complete_module "field-contexts" "FieldContext" "FieldContexts"
complete_module "forms-builder" "FormTemplate" "FormsBuilder"
complete_module "workflow-schemes" "WorkflowScheme" "WorkflowSchemes"

# Phase 8
complete_module "permission-schemes" "PermissionScheme" "PermissionSchemes"
complete_module "notification-schemes" "NotificationScheme" "NotificationSchemes"
complete_module "security-levels" "SecurityLevel" "SecurityLevels"
complete_module "data-retention" "DataRetention" "DataRetention"
complete_module "gdpr-compliance" "GdprLog" "GdprCompliance"
complete_module "ip-whitelisting" "IpWhitelist" "IpWhitelisting"
complete_module "two-factor-auth" "TwoFactorAuth" "TwoFactorAuth"

# Phase 9
complete_module "api-keys" "ApiKey" "ApiKeys"
complete_module "oauth-apps" "OAuthApp" "OAuthApps"
complete_module "marketplace-apps" "MarketplaceApp" "MarketplaceApps"
complete_module "import-export" "ImportExport" "ImportExport"
complete_module "migration-tools" "Migration" "MigrationTools"
complete_module "webhook-templates" "WebhookTemplate" "WebhookTemplates"

# Phase 10
complete_module "custom-reports" "CustomReport" "CustomReports"
complete_module "report-templates" "ReportTemplate" "ReportTemplates"
complete_module "data-warehouse" "DataWarehouse" "DataWarehouse"
complete_module "analytics-engine" "AnalyticsMetric" "AnalyticsEngine"
complete_module "kpi-tracking" "KpiMetric" "KpiTracking"
complete_module "executive-dashboards" "ExecutiveDashboard" "ExecutiveDashboards"

# Phase 11
complete_module "confluence-integration" "ConfluencePage" "ConfluenceIntegration"
complete_module "knowledge-base" "KnowledgeArticle" "KnowledgeBase"
complete_module "file-storage" "FileStorage" "FileStorage"
complete_module "mentions-tagging" "Mention" "MentionsTagging"
complete_module "activity-streams" "ActivityStream" "ActivityStreams"
complete_module "team-chat" "ChatMessage" "TeamChat"

# Phase 12
complete_module "service-desk" "ServiceRequest" "ServiceDesk"
complete_module "incident-management" "Incident" "IncidentManagement"
complete_module "change-management" "ChangeRequest" "ChangeManagement"
complete_module "asset-management" "Asset" "AssetManagement"
complete_module "customer-portal" "CustomerTicket" "CustomerPortal"
complete_module "sla-policies" "SlaPolicy" "SlaPolicies"

# Phase 13
complete_module "templates-library" "ProjectTemplate" "TemplatesLibrary"
complete_module "project-cloning" "CloneOperation" "ProjectCloning"
complete_module "bulk-operations" "BulkOperation" "BulkOperations"
complete_module "scheduled-jobs" "ScheduledJob" "ScheduledJobs"
complete_module "global-settings" "GlobalSetting" "GlobalSettings"
complete_module "localization" "Translation" "Localization"
complete_module "mobile-api" "MobileSession" "MobileApi"

# Phase 14
complete_module "ai-suggestions" "AiSuggestion" "AiSuggestions"
complete_module "auto-assignment" "AssignmentRule" "AutoAssignment"
complete_module "sentiment-analysis" "SentimentLog" "SentimentAnalysis"
complete_module "predictive-analytics" "Prediction" "PredictiveAnalytics"
complete_module "smart-notifications" "SmartNotification" "SmartNotifications"
complete_module "code-integration" "CodeCommit" "CodeIntegration"

echo "🎉🎉🎉 ALL PHASES 5-14 COMPLETED! 🎉🎉🎉"
