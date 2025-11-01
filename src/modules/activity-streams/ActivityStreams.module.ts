import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityStream } from './entities/ActivityStream.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityStream])],
  exports: [TypeOrmModule],
})
export class ActivityStreamsModule {}
