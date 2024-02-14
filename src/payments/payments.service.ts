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
