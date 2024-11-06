import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ClaimVisitBenefitDto,
  CreateCustomerDto,
} from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DbService } from 'src/db/db.service';
import { createPaginator } from 'prisma-pagination';

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
    });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
  async findOneByPhone(phone: string) {
    return this.db.customer.findUnique({
      where: { phone },
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
}
