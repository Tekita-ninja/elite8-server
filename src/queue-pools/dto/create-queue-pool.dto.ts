import { PoolStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateQueuePoolDto {
  @IsOptional()
  public phone: string;
  @IsOptional()
  public name: string;

  // @IsString()
  // @IsOptional()
  // public customerId: string;

  @IsString()
  @IsOptional()
  public phoneNumber: string;

  @IsNumber()
  @IsOptional()
  public queueNumber: number;

  @IsNumber()
  @IsOptional()
  public numOfCall?: number;

  @IsString()
  @IsOptional()
  @IsEnum(PoolStatus, {
    message:
      'status must be one of these values: ' +
      Object.values(PoolStatus).join(', '),
  })
  public status: PoolStatus;
}
