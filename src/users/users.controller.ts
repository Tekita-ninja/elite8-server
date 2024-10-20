import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Request } from 'express';
import { CreateUserDto, UpdateUserDto } from 'src/auth/dto/auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

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
  @Get('all')
  getUsers() {
    return this.usersService.findMany();
  }
  @Get()
  findPaginate(@Query() query: any) {
    return this.usersService.findPaginate(query);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
