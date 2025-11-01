import { PartialType } from '@nestjs/swagger';
import { CreateWorkflowSchemeDto } from './create-workflow-schemes.dto';

export class UpdateWorkflowSchemeDto extends PartialType(CreateWorkflowSchemeDto) {}
