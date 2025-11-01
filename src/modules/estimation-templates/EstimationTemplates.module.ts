import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimationTemplate } from './entities/EstimationTemplate.entity';
import { EstimationTemplatesController } from './estimation-templates.controller';
import { EstimationTemplatesService } from './estimation-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([EstimationTemplate])],
  controllers: [EstimationTemplatesController],
  providers: [EstimationTemplatesService],
  exports: [EstimationTemplatesService, TypeOrmModule],
})
export class EstimationTemplatesModule {}
