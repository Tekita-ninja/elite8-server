import { IsString } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  public status: boolean;
  @IsString()
  public filename: string;
}
