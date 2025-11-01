import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watcher } from './entities/watcher.entity';
import { WatchersController } from './watchers.controller';
import { WatchersService } from './watchers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Watcher])],
  controllers: [WatchersController],
  providers: [WatchersService],
  exports: [WatchersService],
})
export class WatchersModule {}
