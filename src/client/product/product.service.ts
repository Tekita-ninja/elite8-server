import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: any) {
    const { page, rowsPerPage, sortBy, sortType, ...params } = query;
    const take = rowsPerPage ? parseInt(rowsPerPage) : 10;
    const skip = page && page > 0 ? (parseInt(page) - 1) * take : 0;
    const orderField = sortBy || 'createdAt';
    const orderType = sortType || 'desc';
    const search = params.search || '';
    const isPromo =
      params.isPromo && params.isPromo == 1 ? true : false || undefined;
    const where = {
      ...params,
      isPromo,
      search: undefined,
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ],
    };

    // return where;
    const data = await this.prisma.products.findMany({
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
        status: true,
        videos: true,
        price: true,
        stock: true,
        hasVarian: true,
        weight: true,
        freeShiping: true,
        category: true,
        isPromo: true,
        percentDiscount: true,
        varians: {
          select: {
            id: true,
            name: true,
            value: true,
            price: true,
            stock: true,
            hasChild: true,
            subvarian: true,
          },
        },
        images: {
          select: {
            id: true,
            path: true,
          },
        },
      },
    });

    const count = await this.prisma.products.count({ where });
    return {
      meta: {
        current_page: parseInt(page) | 1,
        last_page: Math.ceil(count / take),
        total: count,
      },
      data: data,
    };
  }
  async findOne(slug: string) {
    const data = await this.prisma.products.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true,
        videos: true,
        price: true,
        stock: true,
        hasVarian: true,
        weight: true,
        freeShiping: true,
        isPromo: true,
        percentDiscount: true,
        images: {
          select: {
            id: true,
            path: true,
          },
        },
        varians: {
          select: {
            name: true,
            value: true,
            price: true,
            stock: true,
            hasChild: true,
            subvarian: {
              select: {
                name: true,
                value: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      throw new NotFoundException(`Slug ${slug} Not Found`);
    }
    return data;
  }
}
