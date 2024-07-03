import { PartialType } from '@nestjs/mapped-types';
import { CreateWebUtilDto } from './create-web_util.dto';

export class UpdateWebUtilDto extends PartialType(CreateWebUtilDto) {}
