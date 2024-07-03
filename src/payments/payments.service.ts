import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  create(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payments.create({ data: createPaymentDto });
  }

  findAll() {
    return this.prisma.payments.findMany();
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
    const data = await this.prisma.payments.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.payments.count({ where });

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
    const data = await this.prisma.payments.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.findOne(id);
    return this.prisma.payments.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.prisma.payments.delete({ where: { id } });
  }
}
