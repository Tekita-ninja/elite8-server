import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
class ProductImageDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  path: string;
}
export class SubVarianDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public varianId: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public value: string;

  @IsNotEmpty()
  @IsNumber()
  public price: string;

  @IsNotEmpty()
  @IsNumber()
  public stock: string;
}
export class VarianDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public productId: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public value: string;

  @IsOptional()
  @IsNumber()
  public price: string;

  @IsOptional()
  @IsNumber()
  public stock: string;

  @IsBoolean()
  @IsOptional()
  public hasChild: boolean;

  @ValidateNested({ each: true })
  @Type(() => SubVarianDto)
  @IsOptional()
  subvarian: SubVarianDto[];
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  public categoryId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsBoolean()
  @IsOptional()
  public status: boolean;

  @IsString()
  @IsOptional()
  public videos: string;

  @IsNumber()
  @IsOptional()
  public price: number;

  @IsNumber()
  @IsOptional()
  public stock: number;

  @IsBoolean()
  @IsOptional()
  public hasVarian: boolean;

  @IsNumber()
  @IsOptional()
  public weight: number;

  @IsBoolean()
  @IsOptional()
  public freeShiping: boolean;

  @IsBoolean()
  @IsOptional()
  public isPromo: boolean;

  @IsString()
  @IsOptional()
  public tiktokUrl: string;

  @IsString()
  @IsOptional()
  public shopeeUrl: string;

  @IsString()
  @IsOptional()
  public tokopediaUrl: string;

  @ValidateNested({ each: true })
  @Type(() => VarianDto)
  @IsOptional()
  varians: VarianDto[];

  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  images: ProductImageDto[];
}
