import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('webhooks')
@Controller('webhooks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a webhook' })
  @ApiResponse({ status: 201, description: 'Webhook successfully created' })
  async create(@Body() createWebhookDto: CreateWebhookDto) {
    return this.webhooksService.create(createWebhookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all webhooks' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiResponse({ status: 200, description: 'Returns list of webhooks' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.webhooksService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webhook by ID' })
  @ApiResponse({ status: 200, description: 'Returns webhook details' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update webhook' })
  @ApiResponse({ status: 200, description: 'Webhook successfully updated' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhooksService.update(id, updateWebhookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiResponse({ status: 204, description: 'Webhook successfully deleted' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async remove(@Param('id') id: string) {
    await this.webhooksService.remove(id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test webhook' })
  @ApiResponse({ status: 200, description: 'Test webhook triggered' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async test(@Param('id') id: string) {
    return this.webhooksService.testWebhook(id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get webhook logs' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns webhook execution logs' })
  async getLogs(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.webhooksService.getLogs(id, limit || 50);
  }
}
