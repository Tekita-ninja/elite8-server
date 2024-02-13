import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum TYPE {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  WHATSAPP = 'WHATSAPP',
}

export class CreateContactDto {
  @IsString()
  @IsOptional()
  public icon: string;
  @IsString()
  public name: string;
  @IsString()
  public value: string;

  @IsOptional()
  @IsEnum(TYPE)
  public type: TYPE;
}

export class CreateContactManyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  public data: CreateContactDto[];
}
