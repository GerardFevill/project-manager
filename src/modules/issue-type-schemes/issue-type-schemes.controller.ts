import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IssueTypeSchemesService } from './issue-type-schemes.service';
import { CreateIssueTypeSchemeDto } from './dto/create-issue-type-schemes.dto';
import { UpdateIssueTypeSchemeDto } from './dto/update-issue-type-schemes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('issue-type-schemes')
@Controller('issue-type-schemes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssueTypeSchemesController {
  constructor(private readonly service: IssueTypeSchemesService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateIssueTypeSchemeDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateIssueTypeSchemeDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
