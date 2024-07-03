import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateContactDto,
  CreateContactManyDto,
} from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}
  createMany(createContactDto: CreateContactManyDto) {
    return this.prisma.contacts.createMany({
      data: createContactDto.data,
    });
  }
  create(createContactDto: CreateContactDto) {
    return this.prisma.contacts.create({
      data: createContactDto,
    });
  }

  findAll() {
    return this.prisma.contacts.findMany();
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
    const data = await this.prisma.contacts.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.contacts.count({ where });

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
    const data = await this.prisma.contacts.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return this.prisma.contacts.update({
      where: { id },
      data: updateContactDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contacts.delete({ where: { id } });
  }
}
