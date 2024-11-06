import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVisitHistoryDto {
  @IsString()
  @IsNotEmpty()
  public customerId: string;
  @IsBoolean()
  @IsOptional()
  public status: boolean;
}
