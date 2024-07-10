import { IsBoolean, IsOptional, IsString } from 'class-validator';

enum TYPE {
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
}
export class CreateMessageTemplateDto {
  @IsOptional()
  @IsString()
  public message: string;

  @IsString()
  public type: TYPE;

  @IsBoolean()
  public status: boolean;
}
