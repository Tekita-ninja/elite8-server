import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @Length(10, 16, {
    message: 'Phone has to be at between 10 and 16 chars',
  })
  public phone: string;

  @IsBoolean()
  @IsOptional()
  public status: boolean;

  @IsOptional()
  @IsString()
  public address: string;
}
export class ClaimVisitBenefitDto {
  @IsString()
  @IsNotEmpty()
  public customerId: string;

  @IsNumber()
  @IsNotEmpty()
  public count: number;
}
