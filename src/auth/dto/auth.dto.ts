import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, {
    message: 'Password has to be at between 3 and 20 chars',
  })
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  public email: string;
  @IsNotEmpty()
  password: string;
}
