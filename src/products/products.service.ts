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
        isPromo: true,
        percentDiscount: true,
        tiktokUrl: true,
        tokopediaUrl: true,
        shopeeUrl: true,
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
        tiktokUrl: true,
        tokopediaUrl: true,
        shopeeUrl: true,
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

  async findDetailById(id: string) {
    const data = await this.prisma.products.findUnique({
      where: {
        id,
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
        category: true,
        isPromo: true,
        percentDiscount: true,
        tiktokUrl: true,
        tokopediaUrl: true,
        shopeeUrl: true,
        images: {
          select: {
            id: true,
            path: true,
          },
        },
        varians: {
          select: {
            id: true,
            productId: true,
            name: true,
            value: true,
            price: true,
            stock: true,
            hasChild: true,
            subvarian: {
              select: {
                id: true,
                varianId: true,
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
      throw new NotFoundException(`ID ${id} Not Found`);
    }
    return data;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const ctg = await this.prisma.categories.findUnique({
      where: { id: updateProductDto.categoryId },
    });
    if (!ctg) {
      throw new NotFoundException(
        `ID Category ${updateProductDto.categoryId} Not Found`,
      );
    }

    const oldData = await this.findDetailById(id);
    const oldImages = oldData.images.map((i) => i.id);
    const oldVariantIds = [];
    const oldSubVariantIds = [];
    oldData.varians.forEach((v) => {
      oldVariantIds.push(v.id);
      v.subvarian.forEach((sv) => {
        oldSubVariantIds.push(sv.id);
      });
    });
    const isProductHasVarian =
      updateProductDto.varians && updateProductDto.varians.length > 0;
    const productSlug = createUniqueSlug(updateProductDto.name);

    let productInput;
    if (isProductHasVarian) {
      const isHasSubVarian = !!updateProductDto.varians[0].subvarian;
      if (isHasSubVarian) {
        productInput = {
          categoryId: updateProductDto.categoryId,
          name: updateProductDto.name,
          slug: productSlug,
          description: updateProductDto.description,
          videos: updateProductDto.videos,
          price: updateProductDto.price,
          stock: updateProductDto.stock,
          weight: updateProductDto.weight,
          status: updateProductDto.status,
          hasVarian: isProductHasVarian ? true : false,
          images: {
            create: updateProductDto.images,
          },
          varians: {
            create: updateProductDto.varians.map((item: VarianDto) => {
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
          categoryId: updateProductDto.categoryId,
          name: updateProductDto.name,
          slug: productSlug,
          description: updateProductDto.description,
          videos: updateProductDto.videos,
          price: updateProductDto.price,
          stock: updateProductDto.stock,
          weight: updateProductDto.weight,
          status: updateProductDto.status,
          hasVarian: isProductHasVarian ? true : false,
          images: {
            create: updateProductDto.images,
          },
          varians: {
            create: updateProductDto.varians.map((item: VarianDto) => {
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
        categoryId: updateProductDto.categoryId,
        name: updateProductDto.name,
        slug: productSlug,
        description: updateProductDto.description,
        videos: updateProductDto.videos,
        price: updateProductDto.price,
        stock: updateProductDto.stock,
        weight: updateProductDto.weight,
        status: updateProductDto.status,
        hasVarian: isProductHasVarian ? true : false,
        images: {
          create: updateProductDto.images,
        },
      };
    }

    const responseUpdate = await this.prisma.products.update({
      where: { id },
      data: productInput,
    });
    if (responseUpdate) {
      await this.prisma.productimages.deleteMany({
        where: {
          id: {
            in: oldImages,
          },
        },
      });
      await this.prisma.subvarian.deleteMany({
        where: {
          id: {
            in: oldSubVariantIds,
          },
        },
      });
      await this.prisma.varian.deleteMany({
        where: {
          id: {
            in: oldVariantIds,
          },
        },
      });
    }
    return responseUpdate;
  }
  async changeStatus(id: string, data: { status: boolean }) {
    const product = await this.findById(id);
    if (!product) {
      throw new NotFoundException(`ID Product ${id} Not Found`);
    }
    return this.prisma.products.update({
      where: { id },
      data: data,
    });
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
