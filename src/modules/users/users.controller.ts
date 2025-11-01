import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Returns list of users' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usersService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'Username or email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ========== USER SEARCH & QUERIES ==========

  @Get('search/query')
  @ApiOperation({ summary: 'Search users with advanced query' })
  searchWithQuery(@Query('query') query: string) {
    return { query, results: [] };
  }

  @Get('search/assignable/multiProjectSearch')
  @ApiOperation({ summary: 'Search assignable users across multiple projects' })
  searchAssignableMultiProject(@Query('projectIds') projectIds: string) {
    return { projectIds, users: [] };
  }

  @Get('picker')
  @ApiOperation({ summary: 'User picker for autocomplete' })
  userPicker(@Query('query') query: string) {
    return { query, suggestions: [] };
  }

  // ========== USER RELATIONSHIPS ==========

  @Get(':id/groups')
  @ApiOperation({ summary: 'Get groups for user' })
  getUserGroups(@Param('id') id: string) {
    return { userId: id, groups: [] };
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get permissions for user' })
  getUserPermissions(@Param('id') id: string) {
    return { userId: id, permissions: [] };
  }

  // ========== USER PROPERTIES ==========

  @Get(':id/properties')
  @ApiOperation({ summary: 'Get user properties' })
  getUserProperties(@Param('id') id: string) {
    return { userId: id, properties: {} };
  }

  @Put(':id/properties/:key')
  @ApiOperation({ summary: 'Set user property' })
  setUserProperty(@Param('id') id: string, @Param('key') key: string, @Body() dto: any) {
    return { userId: id, key, value: dto.value };
  }

  @Delete(':id/properties/:key')
  @ApiOperation({ summary: 'Delete user property' })
  deleteUserProperty(@Param('id') id: string, @Param('key') key: string) {
    return { deleted: true };
  }

  // ========== USER AVATAR ==========

  @Get(':id/avatar')
  @ApiOperation({ summary: 'Get user avatar' })
  getUserAvatar(@Param('id') id: string) {
    return { userId: id, avatarUrl: null };
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload user avatar' })
  uploadUserAvatar(@Param('id') id: string, @Body() dto: any) {
    return { userId: id, avatarUrl: dto.url };
  }

  // ========== BULK OPERATIONS ==========

  @Get('bulk')
  @ApiOperation({ summary: 'Get multiple users by IDs' })
  getBulkUsers(@Query('userIds') userIds: string) {
    return { users: [] };
  }

  @Get('bulk/migration')
  @ApiOperation({ summary: 'Get user migration data' })
  getUserMigrationData(@Query('userIds') userIds: string) {
    return { migrationData: [] };
  }

  @Get('email')
  @ApiOperation({ summary: 'Get user by email' })
  getUserByEmail(@Query('email') email: string) {
    return { email, user: null };
  }
}
