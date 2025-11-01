import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldContext } from './entities/FieldContext.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldContext])],
  exports: [TypeOrmModule],
})
export class FieldContextsModule {}
