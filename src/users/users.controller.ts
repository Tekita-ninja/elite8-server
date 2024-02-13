import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    const decodedUser = req.user as { sub: string };
    return this.usersService.findById(decodedUser.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param() params: { id: string }) {
    return this.usersService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.findMany();
  }
}
