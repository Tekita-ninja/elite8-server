import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @IsString()
  public username: string;

  @IsNotEmpty()
  public name: string;
  @IsBoolean()
  @IsOptional()
  public status: boolean;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be at between 3 and 20 chars',
  })
  password: string;
}

export class LoginUserDto {
  @IsString()
  public username: string;
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
