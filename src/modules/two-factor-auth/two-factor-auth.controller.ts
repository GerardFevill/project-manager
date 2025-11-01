import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { CreateTwoFactorAuthDto } from './dto/create-two-factor-auth.dto';
import { UpdateTwoFactorAuthDto } from './dto/update-two-factor-auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('two-factor-auth')
@Controller('two-factor-auth')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TwoFactorAuthController {
  constructor(private readonly service: TwoFactorAuthService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateTwoFactorAuthDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateTwoFactorAuthDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
