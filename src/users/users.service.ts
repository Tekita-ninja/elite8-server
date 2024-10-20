import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createPaginator } from 'prisma-pagination';
import { CreateUserDto, UpdateUserDto } from 'src/auth/dto/auth.dto';
import { DbService } from 'src/db/db.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private db: DbService) {}

  async create(dto: CreateUserDto) {
    const { username, name, password } = dto;
    const user = await this.db.user.findUnique({
      where: { username },
    });
    if (user) {
      throw new BadRequestException('Username already exists');
    }
    const hashedPassword = await this.hashPassword(password);
    const response = await this.db.user.create({
      data: {
        name,
        username,
        hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      },
    });
    return {
      message: 'success create user',
      data: response,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const { password, username, name, status } = dto;
    const user = await this.db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('Username is not exist');
    }
    const hashedPassword = password
      ? await this.hashPassword(password)
      : undefined;
    const response = await this.db.user.update({
      where: { id },
      data: {
        username,
        name,
        hashedPassword,
        status,
      },
      select: {
        id: true,
        name: true,
        username: true,
        hashedPassword: true,
        role: true,
      },
    });
    return {
      message: 'success create user',
      data: response,
    };
  }

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

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
  async remove(id: string) {
    return this.db.user.delete({ where: { id } });
  }
}
