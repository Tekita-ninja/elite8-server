import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findMany() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
      },
    });
  }
}
