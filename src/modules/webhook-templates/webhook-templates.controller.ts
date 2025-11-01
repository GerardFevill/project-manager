import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebhookTemplatesService } from './webhook-templates.service';
import { CreateWebhookTemplateDto } from './dto/create-webhook-templates.dto';
import { UpdateWebhookTemplateDto } from './dto/update-webhook-templates.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('webhook-templates')
@Controller('webhook-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhookTemplatesController {
  constructor(private readonly service: WebhookTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateWebhookTemplateDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateWebhookTemplateDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
