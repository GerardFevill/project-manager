import { PartialType } from '@nestjs/swagger';
import { CreateTimeSheetDto } from './create-timesheets.dto';

export class UpdateTimeSheetDto extends PartialType(CreateTimeSheetDto) {}
