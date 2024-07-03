import { Injectable } from '@nestjs/common';
import { CreateWebUtilDto } from './dto/create-web_util.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebUtilsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWebUtilDto) {
    const response = await this.findUtils();
    if (response.id) {
      return this.prisma.utils.update({
        where: { id: response.id },
        data: dto,
      });
    }
    return this.prisma.utils.create({ data: dto });
  }
  async findUtils() {
    return this.prisma.utils.findFirst();
  }
}
