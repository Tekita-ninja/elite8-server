import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSocialDto {
  @IsString()
  @IsOptional()
  public icon: string;
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public link: string;

  @IsBoolean()
  public status: boolean;
}
