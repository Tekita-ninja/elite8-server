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
