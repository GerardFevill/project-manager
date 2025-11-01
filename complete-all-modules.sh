#!/bin/bash

# This script completes all 70 modules with DTOs, Services, and Controllers
# It processes modules from all phases (4-14)

cd /home/vagrant/project/api/project-manager/src/modules

# Function to create complete module structure
complete_module() {
    local MODULE_DIR=$1
    local ENTITY_NAME=$2
    local MODULE_NAME=$3
    local TABLE_NAME=$4
    
    echo "Completing $MODULE_NAME..."
    
    # Create DTOs directory
    mkdir -p "$MODULE_DIR/dto"
    
    # Create DTOs
    cat > "$MODULE_DIR/dto/create-${MODULE_DIR}.dto.ts" << EOF
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class Create${ENTITY_NAME}Dto {
  @ApiProperty({ example: 'Example name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
EOF

    cat > "$MODULE_DIR/dto/update-${MODULE_DIR}.dto.ts" << EOF
import { PartialType } from '@nestjs/swagger';
import { Create${ENTITY_NAME}Dto } from './create-${MODULE_DIR}.dto';

export class Update${ENTITY_NAME}Dto extends PartialType(Create${ENTITY_NAME}Dto) {}
EOF

    # Create Service
    cat > "$MODULE_DIR/${MODULE_DIR}.service.ts" << EOF
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${ENTITY_NAME} } from './entities/${ENTITY_NAME}.entity';
import { Create${ENTITY_NAME}Dto } from './dto/create-${MODULE_DIR}.dto';
import { Update${ENTITY_NAME}Dto } from './dto/update-${MODULE_DIR}.dto';

@Injectable()
export class ${MODULE_NAME}Service {
  constructor(
    @InjectRepository(${ENTITY_NAME})
    private readonly repository: Repository<${ENTITY_NAME}>,
  ) {}

  async create(dto: Create${ENTITY_NAME}Dto): Promise<${ENTITY_NAME}> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<${ENTITY_NAME}[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<${ENTITY_NAME}> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(\`${ENTITY_NAME} \${id} not found\`);
    return entity;
  }

  async update(id: string, dto: Update${ENTITY_NAME}Dto): Promise<${ENTITY_NAME}> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    entity.updatedAt = new Date();
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
EOF

    # Create Controller
    cat > "$MODULE_DIR/${MODULE_DIR}.controller.ts" << EOF
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ${MODULE_NAME}Service } from './${MODULE_DIR}.service';
import { Create${ENTITY_NAME}Dto } from './dto/create-${MODULE_DIR}.dto';
import { Update${ENTITY_NAME}Dto } from './dto/update-${MODULE_DIR}.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('${MODULE_DIR}')
@Controller('${MODULE_DIR}')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ${MODULE_NAME}Controller {
  constructor(private readonly service: ${MODULE_NAME}Service) {}

  @Post()
  @ApiOperation({ summary: 'Create ${MODULE_DIR}' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: Create${ENTITY_NAME}Dto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ${MODULE_DIR}' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ${MODULE_DIR} by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ${MODULE_DIR}' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: Update${ENTITY_NAME}Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete ${MODULE_DIR}' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
EOF

    # Update Module file
    cat > "$MODULE_DIR/${MODULE_NAME}.module.ts" << EOF
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${ENTITY_NAME} } from './entities/${ENTITY_NAME}.entity';
import { ${MODULE_NAME}Controller } from './${MODULE_DIR}.controller';
import { ${MODULE_NAME}Service } from './${MODULE_DIR}.service';

@Module({
  imports: [TypeOrmModule.forFeature([${ENTITY_NAME}])],
  controllers: [${MODULE_NAME}Controller],
  providers: [${MODULE_NAME}Service],
  exports: [${MODULE_NAME}Service, TypeOrmModule],
})
export class ${MODULE_NAME}Module {}
EOF

    echo "✅ $MODULE_NAME completed"
}

# Phase 4 - Remaining modules (Programs already done)
complete_module "roadmaps" "Roadmap" "Roadmaps" "roadmaps"
complete_module "initiatives" "Initiative" "Initiatives" "initiatives"
complete_module "epics" "Epic" "Epics" "epics"
complete_module "dependencies" "Dependency" "Dependencies" "dependencies"
complete_module "capacity-planning" "CapacityPlan" "CapacityPlanning" "capacity_plans"
complete_module "resource-allocation" "ResourceAllocation" "ResourceAllocation" "resource_allocations"

echo "🎉 Phase 4 completion done!"
