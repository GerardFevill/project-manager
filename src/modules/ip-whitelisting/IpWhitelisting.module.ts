import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpWhitelist } from './entities/IpWhitelist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IpWhitelist])],
  exports: [TypeOrmModule],
})
export class IpWhitelistingModule {}
