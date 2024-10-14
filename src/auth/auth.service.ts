import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { DbService } from 'src/db/db.service';
import { LoginUserDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: DbService,
    private jwt: JwtService,
  ) {}

  async signin(dto: LoginUserDto, req: Request, res: Response) {
    const user = await this.findByUsername(dto.username);
    if (!user) {
      throw new BadRequestException('Invalid credentials!');
    }
    const validPassword = await this.comparePassword(
      dto.password,
      user.hashedPassword,
    );
    if (!validPassword) {
      throw new BadRequestException('Invalid credentials!');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = await this.signToken(payload);
    const refresh_token = await this.signRefreshToken(payload);
    if (!access_token) {
      throw new ForbiddenException();
    }
    res.cookie('access_token', access_token);
    res.cookie('refresh_token', refresh_token);
    await this.prisma.user.update({
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
    const user = await this.prisma.user.findFirst({
      where: {
        id: decodedUser.sub,
        refreshToken: jwt,
        status: true,
      },
    });
    if (!user) {
      throw new ForbiddenException('invalid refresh token');
    }
    const payload = { sub: user.id, username: user.username, role: user.role };
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

  async signToken(args: { sub: string; username: string; role: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1d',
    });
  }
  async decodeToken(token: string) {
    return this.jwt.decode(token);
  }
  async signRefreshToken(args: {
    sub: string;
    username: string;
    role: string;
  }) {
    const payload = args;
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user;
  }
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}
