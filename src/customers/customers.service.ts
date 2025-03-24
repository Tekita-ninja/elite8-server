import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ClaimVisitBenefitDto,
  CreateCustomerDto,
} from './dto/create-customer.dto';
import * as dayjs from 'dayjs';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DbService } from 'src/db/db.service';
import { createPaginator } from 'prisma-pagination';
import { VisitStatsDto } from './dto/stats-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly db: DbService) {}
  deleteMany(ids: string[]) {
    return this.db.customer.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
  async create(createCustomerDto: CreateCustomerDto) {
    const customer = await this.findOneByPhone(createCustomerDto.phone);
    if (customer) {
      throw new BadRequestException('phone number has been registered!');
    }
    return this.db.customer.create({ data: createCustomerDto });
  }

  findAll() {
    return this.db.customer.findMany();
  }

  findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, search, ...params } = query;
    const orderField = sortBy || 'id';
    const orderType = sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const where = {
      ...params,
      name: {
        contains: search,
      },
    };
    const paginate = createPaginator({ page, perPage: rowsPerPage });
    return paginate(this.db.customer, {
      orderBy,
      where,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        visitHistories: true,
        _count: {
          select: {
            visitHistories: { where: { status: true } },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            visitHistories: { where: { status: true } },
          },
        },
      },
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  async findOneByPhone(phone: string) {
    return this.db.customer.findUnique({
      where: { phone },
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            visitHistories: { where: { status: true } },
          },
        },
      },
    });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.db.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.customer.delete({ where: { id } });
  }
  async claimVisitBenefit(dto: ClaimVisitBenefitDto) {
    const data = await this.db.customerVisitHistory.findMany({
      where: {
        customerId: dto.customerId,
        status: true,
      },
      take: dto.count,
    });
    return await this.db.$transaction(
      data.map((item) =>
        this.db.customerVisitHistory.update({
          where: { id: item.id },
          data: {
            status: false,
          },
        }),
      ),
    );
  }

  async findTop(count: number) {
    const data = await this.db.customer.findMany({
      take: +count,
      select: {
        id: true,
        name: true,
        phone: true,
        status: true,
        // visitHistories: true,
        _count: {
          select: {
            visitHistories: { where: { status: true } },
          },
        },
      },
      orderBy: {
        visitHistories: {
          _count: 'desc',
        },
      },
    });

    const mappedData = data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        phone: item.phone,
        countVisit: item._count.visitHistories,
      };
    });

    const sortedData = mappedData.sort((a, b) => b.countVisit - a.countVisit);
    return sortedData;
  }

  async visitStats(query: VisitStatsDto) {
    const startDate = query.start
      ? dayjs(query.start).startOf('day').toISOString()
      : dayjs().startOf('day').toISOString();

    const endDate = query.end
      ? dayjs(query.end).endOf('day').toISOString()
      : dayjs().endOf('day').toISOString();
    const response = await this.db.customerVisitHistory.findMany({
      where: {
        status: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const monthCount = [...response].reduce((acc, item) => {
      const month = new Date(item.date).toISOString().slice(0, 7); // Format YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    const monthCountArray = Object.entries(monthCount).map(
      ([month, count]) => ({
        [month]: count,
      }),
    );

    const dateCountObj = [...response].reduce((acc, item) => {
      const date = new Date(item.date).toISOString().slice(0, 10); // Format YYYY-MM-DD
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const dateCountArray = Object.entries(dateCountObj).map(
      ([date, count]) => ({
        [date]: count,
      }),
    );
    return {
      daily: dateCountArray,
      monthly: monthCountArray,
    };
  }
}
