import { PartialType } from '@nestjs/swagger';
import { CreateTwoFactorAuthDto } from './create-two-factor-auth.dto';

export class UpdateTwoFactorAuthDto extends PartialType(CreateTwoFactorAuthDto) {}
