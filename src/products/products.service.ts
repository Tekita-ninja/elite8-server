import { Injectable } from '@nestjs/common';
import {
  CreateProductDto,
  SubVarianDto,
  VarianDto,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createSlug } from 'src/utils/slug';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    const isProductHasVarian =
      createProductDto.varians && createProductDto.varians.length > 0;
    const productSlug = createSlug(createProductDto.name);
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

  findAll() {
    return this.prisma.products.findMany({
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
      },
    });
  }

  findOne(slug: string) {
    return this.prisma.products.findUnique({
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
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return {
      id,
      updateProductDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async saveProduct(data) {
    return data;
  }
}
