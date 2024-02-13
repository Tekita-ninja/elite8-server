import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocialsService {
  constructor(private prisma: PrismaService) {}
  create(createSocialDto: CreateSocialDto) {
    return this.prisma.socials.create({ data: createSocialDto });
  }

  findAll() {
    return this.prisma.socials.findMany();
  }

  async findOne(id: string) {
    const data = await this.prisma.socials.findUnique({
      where: {
        id: id,
      },
    });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, updateSocialDto: UpdateSocialDto) {
    await this.findOne(id);
    return this.prisma.socials.update({
      where: {
        id: id,
      },
      data: updateSocialDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.socials.delete({
      where: {
        id: id,
      },
    });
  }
}
