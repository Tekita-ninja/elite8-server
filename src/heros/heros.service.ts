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

  async findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, ...params } = query;
    const take = rowsPerPage ? parseInt(rowsPerPage) : 10;
    const skip = page && page > 0 ? (parseInt(page) - 1) * take : 0;
    const orderField = sortBy || 'title';
    const orderType = sortType || 'desc';
    const where = {
      ...params,
      title: {
        contains: params?.title,
      },
    };
    const data = await this.prisma.hero.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.hero.count({ where });

    return {
      meta: {
        current_page: parseInt(page) || 0,
        last_page: Math.ceil(count / take),
        total: count,
      },
      data: data,
    };
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
