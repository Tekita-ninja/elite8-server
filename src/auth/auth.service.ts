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
import { jwtRefreshSecret, jwtSecret } from 'src/utils/constants';
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
    const refresh_token = await this.signRefreshToken(payload);
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('access_token', access_token);
    res.cookie('refresh_token', refresh_token);
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        refreshToken: refresh_token,
      },
    });
    res.send({
      message: 'login sucess',
      user: payload,
      access_token,
      refresh_token,
    });
  }
  async signout(req: Request, res: Response) {
    res.clearCookie('access_token');
    res.send({
      message: 'signout sucess',
    });
  }

  async refreshToken(req: Request, res: Response) {
    const refresh_token = req.headers.authorization;
    if (!refresh_token.startsWith('Bearer')) {
      throw new ForbiddenException('invalid refresh token');
    }
    const jwt = refresh_token.split(' ').pop();
    const decodedUser = (await this.decodeToken(jwt)) as { sub: string };
    if (!decodedUser) {
      throw new ForbiddenException('invalid refresh token');
    }
    const user = await this.prisma.users.findFirst({
      where: {
        id: decodedUser.sub,
        refreshToken: jwt,
        status: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('invalid refresh token');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = await this.signToken(payload);
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('access_token', access_token);
    res.send({
      message: 'refresh token sucess',
      access_token,
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
    return this.jwt.signAsync(payload, { secret: jwtSecret, expiresIn: '1d' });
  }
  async decodeToken(token: string) {
    return this.jwt.decode(token);
  }
  async signRefreshToken(args: { sub: string; email: string; role: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, {
      secret: jwtRefreshSecret,
      expiresIn: '7d',
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });
    return user;
  }
  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
    return user;
  }
}
