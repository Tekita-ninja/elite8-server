import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitHistoryDto } from './create-visit-history.dto';

export class UpdateVisitHistoryDto extends PartialType(CreateVisitHistoryDto) {}
