import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: LoginUserDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
