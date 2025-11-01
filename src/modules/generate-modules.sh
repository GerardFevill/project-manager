#!/bin/bash

# Function to create a basic entity
create_entity() {
    local module=$1
    local entity=$2
    local table=$3
    
    cat > "$module/entities/$entity.entity.ts" << ENTITY
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('$table')
export class $entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
ENTITY
}

# Function to create a basic module
create_module() {
    local dir=$1
    local entity=$2
    local moduleName=$3
    
    cat > "$dir/$moduleName.module.ts" << MODULE
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { $entity } from './entities/$entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([$entity])],
  exports: [TypeOrmModule],
})
export class ${moduleName}Module {}
MODULE
}

# Phase 6 - Finance
create_entity "timesheets" "TimeSheet" "timesheets"
create_module "timesheets" "TimeSheet" "TimeSheets"

create_entity "estimation-templates" "EstimationTemplate" "estimation_templates"
create_module "estimation-templates" "EstimationTemplate" "EstimationTemplates"

create_entity "budget-tracking" "Budget" "budgets"
create_module "budget-tracking" "Budget" "BudgetTracking"

create_entity "invoices" "Invoice" "invoices"
create_module "invoices" "Invoice" "Invoices"

create_entity "cost-analysis" "CostAnalysis" "cost_analysis"
create_module "cost-analysis" "CostAnalysis" "CostAnalysis"

# Phase 7 - Configuration
create_entity "field-configurations" "FieldConfiguration" "field_configurations"
create_module "field-configurations" "FieldConfiguration" "FieldConfigurations"

create_entity "screen-schemes" "ScreenScheme" "screen_schemes"
create_module "screen-schemes" "ScreenScheme" "ScreenSchemes"

create_entity "issue-type-schemes" "IssueTypeScheme" "issue_type_schemes"
create_module "issue-type-schemes" "IssueTypeScheme" "IssueTypeSchemes"

create_entity "field-contexts" "FieldContext" "field_contexts"
create_module "field-contexts" "FieldContext" "FieldContexts"

create_entity "forms-builder" "FormTemplate" "form_templates"
create_module "forms-builder" "FormTemplate" "FormsBuilder"

create_entity "workflow-schemes" "WorkflowScheme" "workflow_schemes"
create_module "workflow-schemes" "WorkflowScheme" "WorkflowSchemes"

echo "Modules created successfully!"
