import { IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class TaskFilterDto {
  @IsOptional()
  @IsEnum(['all', 'active', 'completed'], {
    message: 'Status must be one of: all, active, completed',
  })
  status?: 'all' | 'active' | 'completed' = 'all';

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'], {
    message: 'Priority must be one of: low, medium, high, urgent',
  })
  priority?: 'low' | 'medium' | 'high' | 'urgent';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'onlyOverdue must be a boolean' })
  onlyOverdue?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'onlyRoot must be a boolean' })
  onlyRoot?: boolean = false;

  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  parentId?: string;
}
