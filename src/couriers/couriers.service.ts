import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateCourierDto } from './dto/update-courier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CouriersService {
  constructor(private prisma: PrismaService) {}
  create(createCourierDto: CreateCourierDto) {
    return this.prisma.couriers.create({ data: createCourierDto });
  }

  findAll() {
    return this.prisma.couriers.findMany();
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
    const data = await this.prisma.couriers.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.couriers.count({ where });

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
    const data = await this.prisma.couriers.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, updateCourierDto: UpdateCourierDto) {
    await this.findOne(id);
    return this.prisma.couriers.update({
      where: { id },
      data: updateCourierDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.couriers.delete({ where: { id } });
  }
}
