import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormTemplate } from './entities/FormTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FormTemplate])],
  exports: [TypeOrmModule],
})
export class FormsBuilderModule {}
