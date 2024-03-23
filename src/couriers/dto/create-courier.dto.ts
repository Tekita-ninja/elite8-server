import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourierDto {
  @IsString()
  @IsOptional()
  public icon: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public value: string;

  @IsOptional()
  public status: boolean;
}
