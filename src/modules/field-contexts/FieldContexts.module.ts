import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldContext } from './entities/FieldContext.entity';
import { FieldContextsController } from './field-contexts.controller';
import { FieldContextsService } from './field-contexts.service';

@Module({
  imports: [TypeOrmModule.forFeature([FieldContext])],
  controllers: [FieldContextsController],
  providers: [FieldContextsService],
  exports: [FieldContextsService, TypeOrmModule],
})
export class FieldContextsModule {}
