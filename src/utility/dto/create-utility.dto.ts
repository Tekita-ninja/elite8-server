import { IsOptional, IsString } from 'class-validator';

export class CreateUtilityDto {
  @IsString()
  @IsOptional()
  public appName: string;

  @IsString()
  @IsOptional()
  public logoSmall: string;

  @IsString()
  @IsOptional()
  public logoFull: string;

  @IsString()
  @IsOptional()
  public textColor: string;

  @IsString()
  @IsOptional()
  public bgColor: string;

  @IsString()
  @IsOptional()
  public mainEmail: string;

  @IsString()
  @IsOptional()
  public mainWhatsApp: string;
}
