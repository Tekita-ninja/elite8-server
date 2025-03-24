import { IsOptional, IsString } from 'class-validator';

export class VisitStatsDto {
  @IsOptional()
  @IsString()
  start?: Date;

  @IsOptional()
  @IsString()
  end?: Date;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  time_type?: string;
}
