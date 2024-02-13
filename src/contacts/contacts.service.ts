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
