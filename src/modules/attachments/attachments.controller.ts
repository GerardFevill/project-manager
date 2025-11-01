import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('attachments')
@Controller('attachments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all attachments' })
  @ApiQuery({ name: 'issueId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of attachments' })
  async findAll(@Query('issueId') issueId?: string) {
    return this.attachmentsService.findAll(issueId);
  }

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get all attachments for an issue' })
  @ApiResponse({ status: 200, description: 'Returns list of attachments for the issue' })
  async findByIssue(@Param('issueId') issueId: string) {
    return this.attachmentsService.findByIssue(issueId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiResponse({ status: 200, description: 'Returns attachment details' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async findOne(@Param('id') id: string) {
    return this.attachmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Upload a new attachment' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Attachment successfully uploaded' })
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createAttachmentDto: CreateAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    // TODO: Handle actual file upload to storage
    return this.attachmentsService.create(createAttachmentDto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attachment by ID' })
  @ApiResponse({ status: 204, description: 'Attachment successfully deleted' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  async remove(@Param('id') id: string) {
    return this.attachmentsService.remove(id);
  }
}
