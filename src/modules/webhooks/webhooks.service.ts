import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Webhook, WebhookEvent } from './entities/webhook.entity';
import { WebhookLog } from './entities/webhook-log.entity';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Webhook)
    private readonly webhookRepository: Repository<Webhook>,
    @InjectRepository(WebhookLog)
    private readonly logRepository: Repository<WebhookLog>,
  ) {}

  async create(createWebhookDto: CreateWebhookDto): Promise<Webhook> {
    const webhook = this.webhookRepository.create({
      ...createWebhookDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.webhookRepository.save(webhook);
  }

  async findAll(projectId?: string): Promise<Webhook[]> {
    const query: any = {};

    if (projectId) {
      query.projectId = projectId;
    }

    return this.webhookRepository.find({
      where: query,
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Webhook> {
    const webhook = await this.webhookRepository.findOne({ where: { id } });

    if (!webhook) {
      throw new NotFoundException(`Webhook with ID ${id} not found`);
    }

    return webhook;
  }

  async update(id: string, updateWebhookDto: UpdateWebhookDto): Promise<Webhook> {
    const webhook = await this.findOne(id);

    Object.assign(webhook, updateWebhookDto);
    webhook.updatedAt = new Date();

    return this.webhookRepository.save(webhook);
  }

  async remove(id: string): Promise<void> {
    const webhook = await this.findOne(id);
    await this.webhookRepository.remove(webhook);
  }

  async trigger(event: WebhookEvent, payload: Record<string, any>, projectId?: string): Promise<void> {
    const webhooks = await this.webhookRepository
      .createQueryBuilder('webhook')
      .where('webhook.isActive = :isActive', { isActive: true })
      .andWhere(':event = ANY(webhook.events)', { event })
      .andWhere('(webhook.projectId = :projectId OR webhook.projectId IS NULL)', {
        projectId: projectId || null
      })
      .getMany();

    for (const webhook of webhooks) {
      await this.executeWebhook(webhook, event, payload);
    }
  }

  private async executeWebhook(webhook: Webhook, event: WebhookEvent, payload: Record<string, any>): Promise<void> {
    const startTime = Date.now();
    let success = false;
    let statusCode = 0;
    let errorMessage: string | null = null;
    let response: string | null = null;

    try {
      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        payload,
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Jira-API-Webhook/1.0',
        ...(webhook.headers || {}),
      };

      // Add HMAC signature if secret is configured
      if (webhook.secret) {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(body)
          .digest('hex');
        headers['X-Webhook-Signature'] = signature;
      }

      const fetchResponse = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
      });

      statusCode = fetchResponse.status;
      response = await fetchResponse.text();
      success = fetchResponse.ok;

      if (success) {
        webhook.successCount++;
        webhook.lastSuccessAt = new Date();
      } else {
        webhook.failureCount++;
        webhook.lastFailureAt = new Date();
        errorMessage = `HTTP ${statusCode}: ${response}`;
      }
    } catch (error) {
      webhook.failureCount++;
      webhook.lastFailureAt = new Date();
      errorMessage = error.message;
      statusCode = 0;
    }

    webhook.lastTriggeredAt = new Date();
    await this.webhookRepository.save(webhook);

    // Log the webhook execution
    await this.logRepository.save({
      webhookId: webhook.id,
      event,
      payload,
      statusCode,
      success,
      errorMessage,
      response: response?.substring(0, 1000), // Limit response size
      durationMs: Date.now() - startTime,
      createdAt: new Date(),
    });
  }

  async getLogs(webhookId: string, limit: number = 50): Promise<WebhookLog[]> {
    return this.logRepository.find({
      where: { webhookId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async testWebhook(id: string): Promise<{ success: boolean; message: string }> {
    const webhook = await this.findOne(id);

    await this.executeWebhook(webhook, WebhookEvent.ISSUE_CREATED, {
      test: true,
      message: 'This is a test webhook',
    });

    return {
      success: true,
      message: 'Webhook test triggered. Check logs for results.',
    };
  }
}
