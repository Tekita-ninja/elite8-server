import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageTemplateDto } from './dto/create-message_template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message_template.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageTemplateService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateMessageTemplateDto) {
    return this.prisma.messageTemplate.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.messageTemplate.findMany();
  }
  async findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, ...params } = query;
    const take = rowsPerPage ? parseInt(rowsPerPage) : 10;
    const skip = page && page > 0 ? (parseInt(page) - 1) * take : 0;
    const orderField = sortBy || 'title';
    const orderType = sortType || 'desc';
    const where = {
      ...params,
      title: {
        contains: params?.title,
      },
    };
    const data = await this.prisma.messageTemplate.findMany({
      where,
      take,
      skip,
      orderBy: [
        {
          [orderField]: orderType,
        },
      ],
    });

    const count = await this.prisma.messageTemplate.count({ where });

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
    const data = await this.prisma.messageTemplate.findUnique({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(`ID ${id} Not Found!`);
    }
    return data;
  }

  async update(id: string, dto: UpdateMessageTemplateDto) {
    await this.findOne(id);
    return this.prisma.messageTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.messageTemplate.delete({ where: { id } });
  }
}
