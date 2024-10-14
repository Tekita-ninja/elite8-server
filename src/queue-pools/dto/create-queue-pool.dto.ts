import { PoolStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateQueuePoolDto {
  @IsString()
  public customerId: string;

  @IsNumber()
  @IsOptional()
  public queueNumber: number;

  @IsNumber()
  @IsOptional()
  public numOfCall?: number;

  @IsString()
  @IsEnum(PoolStatus, {
    message:
      'status must be one of these values: ' +
      Object.values(PoolStatus).join(', '),
  })
  public status: PoolStatus;
}
