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

  async findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, ...params } = query;
    const take = rowsPerPage ? parseInt(rowsPerPage) : 10;
    const skip = page && page > 0 ? (parseInt(page) - 1) * take : 0;
    const orderField = sortBy || 'createdAt';
    const orderType = sortType || 'desc';
    const where = {
      ...params,
      name: {
        contains: params?.name,
      },
    };
    const data = await this.prisma.socials.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.socials.count({ where });

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
