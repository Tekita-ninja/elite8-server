import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWebUtilDto {
  @IsString()
  @IsNotEmpty()
  public appName: string;

  @IsString()
  @IsNotEmpty()
  public logoSmall: string;

  @IsString()
  @IsOptional()
  public logoFull: string;

  @IsString()
  @IsOptional()
  public videoProfile: string;

  @IsString()
  @IsOptional()
  public mainEmail: string;

  @IsString()
  public mainWhatsApp: string;

  @IsString()
  @IsOptional()
  public mainPhone: string;
}
