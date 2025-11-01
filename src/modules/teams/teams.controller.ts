import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a team' })
  @ApiResponse({ status: 201, description: 'Team successfully created' })
  async create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teams' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiResponse({ status: 200, description: 'Returns list of teams' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.teamsService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by ID' })
  @ApiResponse({ status: 200, description: 'Returns team details' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update team' })
  @ApiResponse({ status: 200, description: 'Team successfully updated' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateTeamDto>) {
    return this.teamsService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete team (soft delete)' })
  @ApiResponse({ status: 204, description: 'Team successfully deleted' })
  @ApiResponse({ status: 404, description: 'Team not found' })
  async remove(@Param('id') id: string) {
    await this.teamsService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to team' })
  @ApiResponse({ status: 201, description: 'Member successfully added' })
  @ApiResponse({ status: 409, description: 'User already in team' })
  async addMember(@Param('id') teamId: string, @Body() addMemberDto: AddMemberDto) {
    return this.teamsService.addMember(teamId, addMemberDto);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove member from team' })
  @ApiResponse({ status: 204, description: 'Member successfully removed' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async removeMember(@Param('id') teamId: string, @Param('userId') userId: string) {
    await this.teamsService.removeMember(teamId, userId);
  }

  @Put(':id/members/:userId/role')
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Role successfully updated' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async updateMemberRole(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
  ) {
    return this.teamsService.updateMemberRole(teamId, userId, body.role);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get teams for a user' })
  @ApiResponse({ status: 200, description: 'Returns user teams' })
  async getUserTeams(@Param('userId') userId: string) {
    return this.teamsService.getUserTeams(userId);
  }
}
