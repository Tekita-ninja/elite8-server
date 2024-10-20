import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQueuePoolDto } from './dto/create-queue-pool.dto';
import { UpdateQueuePoolDto } from './dto/update-queue-pool.dto';
import { DbService } from 'src/db/db.service';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class QueuePoolsService {
  constructor(private readonly db: DbService) {}
  async create(createQueuePoolDto: CreateQueuePoolDto) {
    let customerId;
    const customer = await this.db.customer.findFirst({
      where: {
        phone: createQueuePoolDto.phone,
      },
    });
    if (customer) {
      customerId = customer.id;
      await this.db.customer.update({
        where: {
          id: customer.id,
        },
        data: {
          name: createQueuePoolDto.name,
        },
      });
    } else {
      const newCustomer = await this.db.customer.create({
        data: {
          name: createQueuePoolDto.name,
          phone: createQueuePoolDto.phone,
          status: true,
        },
      });
      customerId = newCustomer.id;
    }

    return this.db.queuePool.create({
      data: {
        customerId: customerId,
        queueNumber: createQueuePoolDto.queueNumber || 0,
        numOfCall: createQueuePoolDto.numOfCall || 0,
        status: 'WAITING',
      },
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
    const orderField = sortBy || 'id';
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
      where: { id: +id },
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
      where: { id: +id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.queuePool.delete({ where: { id: +id } });
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

  async setPlay(id: string) {
    const currentPlayer = await this.findOne(id);
    const prevPlayer = await this.db.queuePool.findMany({
      where: {
        id: {
          lt: +id,
        },
        status: 'WAITING',
      },
    });
    for (let i = 0; i < prevPlayer.length; i++) {
      const player = prevPlayer[i];
      await this.db.queuePool.update({
        data: {
          numOfCall: player.numOfCall + 1,
          status: player.numOfCall >= 4 ? 'REMOVED' : 'WAITING',
        },
        where: {
          id: player.id,
        },
      });
    }
    const completePlayer = await this.db.queuePool.update({
      data: {
        status: 'COMPLETE',
      },
      where: {
        id: currentPlayer.id,
      },
    });
    return completePlayer;
  }
}
