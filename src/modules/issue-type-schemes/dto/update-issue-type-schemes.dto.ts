import { PartialType } from '@nestjs/swagger';
import { CreateIssueTypeSchemeDto } from './create-issue-type-schemes.dto';

export class UpdateIssueTypeSchemeDto extends PartialType(CreateIssueTypeSchemeDto) {}
