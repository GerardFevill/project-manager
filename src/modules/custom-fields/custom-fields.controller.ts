import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomFieldsService } from './custom-fields.service';
import { CreateCustomFieldDto } from './dto/create-custom-field.dto';
import { UpdateCustomFieldDto } from './dto/update-custom-field.dto';
import { SetFieldValueDto } from './dto/set-field-value.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('custom-fields')
@Controller('custom-fields')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  // Field Definitions
  @Get()
  @ApiOperation({ summary: 'Get all custom fields' })
  @ApiResponse({ status: 200, description: 'Returns list of custom fields' })
  async findAll() {
    return this.customFieldsService.findAllFields();
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get custom fields for a project' })
  @ApiResponse({ status: 200, description: 'Returns custom fields applicable to project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.customFieldsService.findFieldsByProject(projectId);
  }

  @Get('issue-type/:issueType')
  @ApiOperation({ summary: 'Get custom fields for an issue type' })
  @ApiResponse({ status: 200, description: 'Returns custom fields applicable to issue type' })
  async findByIssueType(@Param('issueType') issueType: string) {
    return this.customFieldsService.findFieldsByIssueType(issueType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get custom field by ID' })
  @ApiResponse({ status: 200, description: 'Returns custom field details' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  async findOne(@Param('id') id: string) {
    return this.customFieldsService.findField(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new custom field' })
  @ApiResponse({ status: 201, description: 'Field successfully created' })
  @ApiResponse({ status: 409, description: 'Field key already exists' })
  async create(@Body() createCustomFieldDto: CreateCustomFieldDto) {
    return this.customFieldsService.createField(createCustomFieldDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update custom field by ID' })
  @ApiResponse({ status: 200, description: 'Field successfully updated' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  async update(@Param('id') id: string, @Body() updateCustomFieldDto: UpdateCustomFieldDto) {
    return this.customFieldsService.updateField(id, updateCustomFieldDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete custom field by ID' })
  @ApiResponse({ status: 204, description: 'Field successfully deleted' })
  @ApiResponse({ status: 404, description: 'Field not found' })
  async remove(@Param('id') id: string) {
    return this.customFieldsService.removeField(id);
  }

  // Field Values
  @Post('values')
  @ApiOperation({ summary: 'Set custom field value for an issue' })
  @ApiResponse({ status: 201, description: 'Value successfully set' })
  async setFieldValue(@Body() setFieldValueDto: SetFieldValueDto) {
    return this.customFieldsService.setFieldValue(setFieldValueDto);
  }

  @Get('values/issue/:issueId')
  @ApiOperation({ summary: 'Get all custom field values for an issue' })
  @ApiResponse({ status: 200, description: 'Returns all field values for the issue' })
  async getIssueFieldValues(@Param('issueId') issueId: string) {
    return this.customFieldsService.getIssueFieldValues(issueId);
  }

  @Get('values/issue/:issueId/field/:customFieldId')
  @ApiOperation({ summary: 'Get custom field value for an issue' })
  @ApiResponse({ status: 200, description: 'Returns field value' })
  async getFieldValue(
    @Param('issueId') issueId: string,
    @Param('customFieldId') customFieldId: string,
  ) {
    return this.customFieldsService.getFieldValue(issueId, customFieldId);
  }

  @Delete('values/issue/:issueId/field/:customFieldId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove custom field value' })
  @ApiResponse({ status: 204, description: 'Value successfully removed' })
  @ApiResponse({ status: 404, description: 'Value not found' })
  async removeFieldValue(
    @Param('issueId') issueId: string,
    @Param('customFieldId') customFieldId: string,
  ) {
    return this.customFieldsService.removeFieldValue(issueId, customFieldId);
  }
}
