import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScreensService } from './screens.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateScreenDto, UpdateScreenDto } from './dto/screen.dto';
import { CreateScreenTabDto, UpdateScreenTabDto, AddFieldToTabDto } from './dto/screen-tab.dto';

@ApiTags('screens')
@Controller('screens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  // ========== SCREENS ==========

  @Get()
  @ApiOperation({ summary: 'Get all screens' })
  @ApiResponse({ status: 200 })
  getScreens() {
    return this.screensService.getScreens();
  }

  @Post()
  @ApiOperation({ summary: 'Create screen' })
  @ApiResponse({ status: 201 })
  createScreen(@Body() dto: CreateScreenDto) {
    return this.screensService.createScreen(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get screen by ID' })
  @ApiResponse({ status: 200 })
  getScreen(@Param('id') id: string) {
    return this.screensService.getScreen(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update screen' })
  @ApiResponse({ status: 200 })
  updateScreen(@Param('id') id: string, @Body() dto: UpdateScreenDto) {
    return this.screensService.updateScreen(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete screen' })
  @ApiResponse({ status: 204 })
  async deleteScreen(@Param('id') id: string) {
    await this.screensService.deleteScreen(id);
  }

  @Get(':id/availableFields')
  @ApiOperation({ summary: 'Get available fields for screen' })
  @ApiResponse({ status: 200 })
  getAvailableFields(@Param('id') id: string) {
    return this.screensService.getAvailableFields(id);
  }

  // ========== SCREEN TABS ==========

  @Get(':screenId/tabs')
  @ApiOperation({ summary: 'Get all tabs for a screen' })
  @ApiResponse({ status: 200 })
  getScreenTabs(@Param('screenId') screenId: string) {
    return this.screensService.getScreenTabs(screenId);
  }

  @Post(':screenId/tabs')
  @ApiOperation({ summary: 'Create tab for screen' })
  @ApiResponse({ status: 201 })
  createScreenTab(
    @Param('screenId') screenId: string,
    @Body() dto: CreateScreenTabDto,
  ) {
    return this.screensService.createScreenTab(screenId, dto);
  }

  @Get(':screenId/tabs/:tabId')
  @ApiOperation({ summary: 'Get screen tab by ID' })
  @ApiResponse({ status: 200 })
  getScreenTab(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
  ) {
    return this.screensService.getScreenTab(tabId);
  }

  @Put(':screenId/tabs/:tabId')
  @ApiOperation({ summary: 'Update screen tab' })
  @ApiResponse({ status: 200 })
  updateScreenTab(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
    @Body() dto: UpdateScreenTabDto,
  ) {
    return this.screensService.updateScreenTab(tabId, dto);
  }

  @Delete(':screenId/tabs/:tabId')
  @ApiOperation({ summary: 'Delete screen tab' })
  @ApiResponse({ status: 204 })
  async deleteScreenTab(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
  ) {
    await this.screensService.deleteScreenTab(tabId);
  }

  // ========== TAB FIELDS ==========

  @Get(':screenId/tabs/:tabId/fields')
  @ApiOperation({ summary: 'Get all fields in a tab' })
  @ApiResponse({ status: 200 })
  getTabFields(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
  ) {
    return this.screensService.getTabFields(tabId);
  }

  @Post(':screenId/tabs/:tabId/fields')
  @ApiOperation({ summary: 'Add field to tab' })
  @ApiResponse({ status: 201 })
  addFieldToTab(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
    @Body() dto: AddFieldToTabDto,
  ) {
    return this.screensService.addFieldToTab(tabId, dto);
  }

  @Delete(':screenId/tabs/:tabId/fields/:fieldId')
  @ApiOperation({ summary: 'Remove field from tab' })
  @ApiResponse({ status: 204 })
  async removeFieldFromTab(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
    @Param('fieldId') fieldId: string,
  ) {
    await this.screensService.removeFieldFromTab(tabId, fieldId);
  }

  @Get(':screenId/tabs/:tabId/fields/all')
  @ApiOperation({ summary: 'Get all fields in tab with details' })
  @ApiResponse({ status: 200 })
  getAllTabFields(
    @Param('screenId') screenId: string,
    @Param('tabId') tabId: string,
  ) {
    return this.screensService.getAllTabFields(tabId);
  }

  @Post('addToDefault/:fieldId')
  @ApiOperation({ summary: 'Add field to default screen' })
  @ApiResponse({ status: 200 })
  addFieldToDefaultScreen(@Param('fieldId') fieldId: string) {
    return this.screensService.addFieldToDefaultScreen(fieldId);
  }
}
