import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Webhook } from './webhook.entity';

@Entity('webhook_logs')
export class WebhookLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  webhookId: string;

  @ManyToOne(() => Webhook)
  @JoinColumn({ name: 'webhook_id' })
  webhook: Webhook;

  @Column({ type: 'varchar', length: 50 })
  event: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column({ type: 'int' })
  statusCode: number;

  @Column({ type: 'boolean' })
  success: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'text', nullable: true })
  response: string;

  @Column({ type: 'int' })
  durationMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
