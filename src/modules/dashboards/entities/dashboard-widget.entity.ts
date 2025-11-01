import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Dashboard } from './dashboard.entity';

export enum WidgetType {
  ISSUE_STATISTICS = 'issue_statistics',
  SPRINT_BURNDOWN = 'sprint_burndown',
  PIE_CHART = 'pie_chart',
  ACTIVITY_STREAM = 'activity_stream',
  ASSIGNED_TO_ME = 'assigned_to_me',
  CREATED_VS_RESOLVED = 'created_vs_resolved',
  FILTER_RESULTS = 'filter_results',
  TIME_TRACKING = 'time_tracking',
  HEAT_MAP = 'heat_map',
  SPRINT_HEALTH = 'sprint_health',
}

@Entity('dashboard_widgets')
export class DashboardWidget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  dashboardId: string;

  @ManyToOne(() => Dashboard, dashboard => dashboard.widgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dashboard_id' })
  dashboard: Dashboard;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50 })
  type: WidgetType;

  @Column({ type: 'jsonb' })
  config: Record<string, any>; // Widget-specific configuration (filterId, projectId, etc.)

  @Column({ type: 'int' })
  positionX: number;

  @Column({ type: 'int' })
  positionY: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'int', default: 300 })
  refreshInterval: number; // Seconds

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
