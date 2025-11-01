import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorAuth } from './entities/TwoFactorAuth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TwoFactorAuth])],
  exports: [TypeOrmModule],
})
export class TwoFactorAuthModule {}
