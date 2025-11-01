import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search across all entities' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'types', required: false, description: 'Entity types to search (comma-separated)' })
  @ApiQuery({ name: 'projectId', required: false, description: 'Limit search to project' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(
    @Query('q') query: string,
    @Query('types') types?: string,
    @Query('projectId') projectId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.searchService.search({
      query,
      types: types ? types.split(',') : undefined,
      projectId,
      limit: limit || 50,
      offset: offset || 0,
    });
  }

  @Get('quick')
  @ApiOperation({ summary: 'Quick search for autocomplete' })
  @ApiQuery({ name: 'q', description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns quick search results' })
  async quickSearch(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.quickSearch(query, limit || 10);
  }
}
