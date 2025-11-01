import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from './entities/FormTemplate.entity';
import { FormsBuilderController } from './forms-builder.controller';
import { FormsBuilderService } from './forms-builder.service';

@Module({
  imports: [TypeOrmModule.forFeature([FormTemplate])],
  controllers: [FormsBuilderController],
  providers: [FormsBuilderService],
  exports: [FormsBuilderService, TypeOrmModule],
})
export class FormsBuilderModule {}
