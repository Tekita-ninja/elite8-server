import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createSlug } from 'src/utils/slug';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const slugText = createSlug(createCategoryDto.name);
    const lastNumber = await this.findLastNumber();
    const data = {
      sortNumber: lastNumber,
      slug: slugText,
      ...createCategoryDto,
    };
    return this.prisma.categories.create({ data });
  }

  findAll() {
    return this.prisma.categories.findMany({
      where: {
        status: true,
      },
      orderBy: {
        sortNumber: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });
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
      description: {
        contains: params?.description,
      },
    };
    const data = await this.prisma.categories.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        sortNumber: true,
      },
    });

    const count = await this.prisma.categories.count({ where });

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
    const data = await this.prisma.categories.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} not found!`);
    }
    return data;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.categories.delete({
      where: { id },
    });
  }

  // EXTRA
  async findLastNumber() {
    const response = await this.prisma.categories.findFirst({
      orderBy: {
        sortNumber: 'desc',
      },
      select: {
        id: true,
        sortNumber: true,
      },
    });
    return response.sortNumber ? response.sortNumber + 1 : 1;
  }
}
