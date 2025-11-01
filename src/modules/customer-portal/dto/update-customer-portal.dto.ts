import { PartialType } from '@nestjs/swagger';
import { CreateCustomerTicketDto } from './create-customer-portal.dto';

export class UpdateCustomerTicketDto extends PartialType(CreateCustomerTicketDto) {}
