import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimationTemplate } from './entities/EstimationTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstimationTemplate])],
  exports: [TypeOrmModule],
})
export class EstimationTemplatesModule {}
