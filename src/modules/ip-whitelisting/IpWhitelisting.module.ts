import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpWhitelist } from './entities/IpWhitelist.entity';
import { IpWhitelistingController } from './ip-whitelisting.controller';
import { IpWhitelistingService } from './ip-whitelisting.service';

@Module({
  imports: [TypeOrmModule.forFeature([IpWhitelist])],
  controllers: [IpWhitelistingController],
  providers: [IpWhitelistingService],
  exports: [IpWhitelistingService, TypeOrmModule],
})
export class IpWhitelistingModule {}
