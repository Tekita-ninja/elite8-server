import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { DbService } from 'src/db/db.service';
import { createPaginator } from 'prisma-pagination';
import * as fs from 'fs';
@Injectable()
export class BannersService {
  constructor(private readonly db: DbService) {}
  create(createBannerDto: CreateBannerDto[]) {
    return this.db.banner.createMany({
      data: createBannerDto,
    });
  }

  findPaginate(query: any) {
    const { page, rowsPerPage, sortBy, sortType, search, ...params } = query;
    const orderField = sortBy || 'id';
    const orderType = sortType || 'desc';
    const orderBy = { [orderField]: orderType };
    const where = {
      ...params,
      filename: {
        contains: search,
      },
    };
    const paginate = createPaginator({ page, perPage: rowsPerPage });
    return paginate(this.db.banner, {
      orderBy,
      where,
      select: {
        id: true,
        filename: true,
        status: true,
      },
    });
  }

  findAll() {
    return `This action returns all banners`;
  }

  async findOne(id: string) {
    const result = await this.db.banner.findUnique({ where: { id } });
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async remove(id: string) {
    const banner = await this.findOne(id);
    const deletedSource = await this.db.banner.delete({
      where: { id },
    });
    if (deletedSource) {
      fs.unlink(`./uploads/${banner.filename}`, (err) => {
        if (err) {
          console.error('An error occurred:', err);
        } else {
          console.log('File deleted successfully!');
        }
      });
    }

    return deletedSource;
  }
}
