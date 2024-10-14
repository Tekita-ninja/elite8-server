import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQueuePoolDto } from './dto/create-queue-pool.dto';
import { UpdateQueuePoolDto } from './dto/update-queue-pool.dto';
import { DbService } from 'src/db/db.service';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class QueuePoolsService {
  constructor(private readonly db: DbService) {}
  create(createQueuePoolDto: CreateQueuePoolDto) {
    return this.db.queuePool.create({
      data: createQueuePoolDto,
    });
  }

  findAll(query?: any) {
    const where = {
      ...query,
    };
    return this.db.queuePool.findMany({
      where,
      include: {
        customer: true,
      },
    });
  }
  findList() {
    return this.db.queuePool.findMany({
      where: {
        status: 'WAITING',
      },
      include: {
        customer: true,
      },
    });
  }

  findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, ...params } = query;
    const orderField = sortBy || 'queueNumber';
    const orderType = sortType || 'asc';
    const orderBy = { [orderField]: orderType };
    const where = {
      ...params,
    };
    const paginate = createPaginator({ page, perPage: rowsPerPage });
    return paginate(this.db.queuePool, {
      orderBy,
      where,
      include: {
        customer: true,
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.queuePool.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async update(id: string, data: UpdateQueuePoolDto) {
    await this.findOne(id);
    return this.db.queuePool.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.queuePool.delete({ where: { id } });
  }

  async getLastNumberWaiting() {
    const d = await this.db.queuePool.findFirst({
      where: {
        status: 'WAITING',
      },
      orderBy: {
        queueNumber: 'desc',
      },
    });

    return d ? d.queueNumber : 0;
  }
}
