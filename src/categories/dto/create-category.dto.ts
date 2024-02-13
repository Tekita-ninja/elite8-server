import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  public name: string;
  @IsNotEmpty()
  public description: string;
}
