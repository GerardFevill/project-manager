import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from './create-invoices.dto';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
