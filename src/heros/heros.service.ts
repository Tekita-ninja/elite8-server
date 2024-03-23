import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HerosService {
  constructor(private prisma: PrismaService) {}
  create(createHeroDto: CreateHeroDto) {
    return this.prisma.hero.create({ data: createHeroDto });
  }

  findAll() {
    return this.prisma.hero.findMany();
  }

  async findOne(id: string) {
    const data = await this.prisma.hero.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, updateHeroDto: UpdateHeroDto) {
    await this.findOne(id);
    return this.prisma.hero.update({
      where: { id },
      data: updateHeroDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.hero.delete({ where: { id } });
  }
}
