import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}
  create(createStoreDto: CreateStoreDto) {
    return this.prisma.stores.create({ data: createStoreDto });
  }

  findAll() {
    return this.prisma.stores.findMany();
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
    const data = await this.prisma.stores.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.stores.count({ where });

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
    const data = await this.prisma.stores.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    await this.findOne(id);
    return this.prisma.stores.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.stores.delete({ where: { id } });
  }
}
