import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsNotEmpty()
  public slug: string;

  @IsOptional()
  @IsNotEmpty()
  public description: string;

  @IsOptional()
  @IsNumber()
  public sortNumber: number;

  @IsOptional()
  @IsBoolean()
  public status: boolean;
}
