import { Injectable, NotFoundException } from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(private db: DbService) {}
  async findById(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        status: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findMany() {
    return this.db.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        status: true,
      },
    });
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
    return paginate(this.db.user, {
      orderBy,
      where,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        status: true,
      },
    });
  }
}
