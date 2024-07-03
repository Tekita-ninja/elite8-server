import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @IsOptional()
  @IsString()
  public image: string;

  @IsOptional()
  @IsString()
  public title: string;

  @IsOptional()
  @IsString()
  public subtitle: string;

  @IsNotEmpty()
  @IsString()
  public caption: string;

  @IsString()
  @IsOptional()
  public link: string;
}
