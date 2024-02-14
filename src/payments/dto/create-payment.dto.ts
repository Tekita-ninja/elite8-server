import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsOptional()
  public icon: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public holder: string;

  @IsNotEmpty()
  @IsString()
  public number: string;

  @IsOptional()
  public status: boolean;
}
