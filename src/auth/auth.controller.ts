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
import { LoginUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: LoginUserDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req, @Res() res) {
    return this.authService.refreshToken(req, res);
  }
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
