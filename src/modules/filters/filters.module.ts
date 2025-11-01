import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Filter } from './entities/filter.entity';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Filter])],
  controllers: [FiltersController],
  providers: [FiltersService],
  exports: [FiltersService],
})
export class FiltersModule {}
