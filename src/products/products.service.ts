import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUniqueSlug } from 'src/utils/slug';
import {
  CreateProductDto,
  SubVarianDto,
  VarianDto,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    // CEK IS CATEGORY ADA
    const ctg = await this.prisma.categories.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!ctg) {
      throw new NotFoundException(
        `ID Category ${createProductDto.categoryId} Not Found`,
      );
    }

    const isProductHasVarian =
      createProductDto.varians && createProductDto.varians.length > 0;
    const productSlug = createUniqueSlug(createProductDto.name);

    let productInput;
    if (isProductHasVarian) {
      const isHasSubVarian = !!createProductDto.varians[0].subvarian;
      if (isHasSubVarian) {
        productInput = {
          categoryId: createProductDto.categoryId,
          name: createProductDto.name,
          slug: productSlug,
          description: createProductDto.description,
          videos: createProductDto.videos,
          price: createProductDto.price,
          stock: createProductDto.stock,
          weight: createProductDto.weight,
          status: createProductDto.status,
          hasVarian: isProductHasVarian ? true : false,
          images: {
            create: createProductDto.images,
          },
          varians: {
            create: createProductDto.varians.map((item: VarianDto) => {
              return {
                hasChild: true,
                ...item,
                subvarian: {
                  create: item.subvarian.map((item: SubVarianDto) => {
                    return item;
                  }),
                },
              };
            }),
          },
        };
      } else {
        productInput = {
          categoryId: createProductDto.categoryId,
          name: createProductDto.name,
          slug: productSlug,
          description: createProductDto.description,
          videos: createProductDto.videos,
          price: createProductDto.price,
          stock: createProductDto.stock,
          weight: createProductDto.weight,
          status: createProductDto.status,
          hasVarian: isProductHasVarian ? true : false,
          images: {
            create: createProductDto.images,
          },
          varians: {
            create: createProductDto.varians.map((item: VarianDto) => {
              return {
                hasChild: false,
                ...item,
              };
            }),
          },
        };
      }
    } else {
      productInput = {
        categoryId: createProductDto.categoryId,
        name: createProductDto.name,
        slug: productSlug,
        description: createProductDto.description,
        videos: createProductDto.videos,
        price: createProductDto.price,
        stock: createProductDto.stock,
        weight: createProductDto.weight,
        status: createProductDto.status,
        hasVarian: isProductHasVarian ? true : false,
        images: {
          create: createProductDto.images,
        },
      };
    }
    return this.prisma.products.create({
      data: productInput,
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
    };
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    return {
      messgage: 'Fitur belum jalan',
      id,
      data: updateProductDto,
    };
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.products.delete({ where: { id } });
  }
  async findById(id: string) {
    const data = await this.prisma.products.findUnique({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found`);
    }
    return data;
  }
}
