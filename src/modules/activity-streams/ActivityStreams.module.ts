import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityStream } from './entities/ActivityStream.entity';
import { ActivityStreamsController } from './activity-streams.controller';
import { ActivityStreamsService } from './activity-streams.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityStream])],
  controllers: [ActivityStreamsController],
  providers: [ActivityStreamsService],
  exports: [ActivityStreamsService, TypeOrmModule],
})
export class ActivityStreamsModule {}
