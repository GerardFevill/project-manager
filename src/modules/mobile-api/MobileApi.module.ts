import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileSession } from './entities/MobileSession.entity';
import { MobileApiController } from './mobile-api.controller';
import { MobileApiService } from './mobile-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([MobileSession])],
  controllers: [MobileApiController],
  providers: [MobileApiService],
  exports: [MobileApiService, TypeOrmModule],
})
export class MobileApiModule {}
