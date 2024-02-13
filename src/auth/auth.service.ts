import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { jwtSecret } from 'src/utils/constants';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const { email, name, password } = dto;
    const user = await this.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const response = await this.prisma.users.create({
      data: {
        name,
        email,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return {
      message: 'success create account',
      data: response,
    };
  }
  async signin(dto: LoginUserDto, req: Request, res: Response) {
    const user = await this.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Invalid crdentials!');
    }
    const validPassword = await this.comparePassword(
      dto.password,
      user.hashedPassword,
    );
    if (!validPassword) {
      throw new NotFoundException('Invalid crdentials!');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.signToken(payload);
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('access_token', access_token);
    res.send({
      message: 'login sucess',
      user: payload,
      access_token,
    });
  }
  async signout(req: Request, res: Response) {
    res.clearCookie('access_token');
    res.send({
      message: 'signout sucess',
    });
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async signToken(args: { sub: string; email: string; role: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    return user;
  }
}
