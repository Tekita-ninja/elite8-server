import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { DbService } from 'src/db/db.service';
import { CreateQueuePoolDto } from './dto/create-queue-pool.dto';
import { UpdateQueuePoolDto } from './dto/update-queue-pool.dto';

@Injectable()
export class QueuePoolsService {
  constructor(private readonly db: DbService) {}
  async create(createQueuePoolDto: CreateQueuePoolDto) {
    const phoneNumberFix = createQueuePoolDto.phoneNumber.split('-').join('');
    const wl = await this.db.queuePool.findFirst({
      where: {
        phoneNumber: phoneNumberFix,
        status: 'WAITING',
      },
    });

    if (wl) {
      throw new BadRequestException('Customer is exist ini waitlist!');
    } else {
      const customer = await this.db.customer.findFirst({
        where: {
          phone: phoneNumberFix,
        },
      });

      if (customer) {
        await this.db.customer.update({
          where: {
            phone: customer.phone,
          },
          data: {
            name: createQueuePoolDto.name,
          },
        });
      } else {
        await this.db.customer.create({
          data: {
            name: createQueuePoolDto.name,
            phone: phoneNumberFix,
            status: true,
          },
        });
      }
      return this.db.queuePool.create({
        data: {
          name: createQueuePoolDto.name,
          phoneNumber: phoneNumberFix,
          queueNumber: createQueuePoolDto.queueNumber || 0,
          numOfCall: createQueuePoolDto.numOfCall || 0,
          status: 'WAITING',
        },
      });
    }
  }

  findAll(query?: any) {
    const where = {
      ...query,
    };
    return this.db.queuePool.findMany({
      where,
    });
  }
  findList() {
    return this.db.queuePool.findMany({
      where: {
        status: 'WAITING',
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
    });
  }

  async findOne(id: string) {
    const result = await this.db.queuePool.findUnique({
      where: { id: +id },
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
    const customer = await this.db.customer.findFirst({
      where: {
        phone: currentPlayer.phoneNumber,
      },
    });
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
    await this.db.customerVisitHistory.create({
      data: {
        customerId: customer.id,
      },
    });
    return completePlayer;
  }

  async removeMultiple(queueIds: number[]) {
    return this.db.queuePool.updateMany({
      data: {
        status: 'REMOVED',
      },
      where: {
        id: {
          in: queueIds,
        },
        status: 'WAITING',
      },
    });
  }
}
