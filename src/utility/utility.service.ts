import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateUtilityDto } from './dto/create-utility.dto';

@Injectable()
export class UtilityService {
  constructor(private readonly db: DbService) {}
  async create(createUtilityDto: CreateUtilityDto) {
    const result = await this.find();
    if (!result) {
      return await this.db.utility.create({
        data: createUtilityDto,
      });
    } else {
      return await this.db.utility.update({
        where: { id: result.id },
        data: createUtilityDto,
      });
    }
  }

  async find() {
    const result = await this.db.utility.findFirst();
    return result;
  }

  async upload(fileName: string, file: Buffer) {
    return {
      fileName,
      file,
    };
  }
  async summary() {
    const customer = await this.db.customer.count({
      where: {
        status: true,
      },
    });
    const user = await this.db.user.count({
      where: {
        status: true,
      },
    });
    const waiting = await this.db.queuePool.count({
      where: {
        status: 'WAITING',
      },
    });
    const complete = await this.db.queuePool.count({
      where: {
        status: 'COMPLETE',
      },
    });
    const removed = await this.db.queuePool.count({
      where: {
        status: 'REMOVED',
      },
    });

    return [
      {
        title: 'Master',
        data: [
          {
            label: 'Customers',
            count: customer,
            path: 'customers',
          },
          {
            label: 'Users',
            count: user,
            path: 'users',
          },
        ],
      },
      {
        title: 'Waitlist',
        data: [
          {
            label: 'Waiting',
            count: waiting,
            path: 'waitlist?page=1&rowsPerPage=10&status=WAITING',
          },
          {
            label: 'Removed',
            count: removed,
            path: 'removed?page=1&rowsPerPage=10&status=REMOVED',
          },
          {
            label: 'Done',
            count: complete,
            path: 'complete?page=1&rowsPerPage=10&status=COMPLETE',
          },
        ],
      },
    ];
  }
}
