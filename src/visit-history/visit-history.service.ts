import { Injectable } from '@nestjs/common';
import { CreateVisitHistoryDto } from './dto/create-visit-history.dto';
import { UpdateVisitHistoryDto } from './dto/update-visit-history.dto';

@Injectable()
export class VisitHistoryService {
  create(createVisitHistoryDto: CreateVisitHistoryDto) {
    return 'This action adds a new visitHistory';
  }

  findAll() {
    return `This action returns all visitHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visitHistory`;
  }

  update(id: number, updateVisitHistoryDto: UpdateVisitHistoryDto) {
    return `This action updates a #${id} visitHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} visitHistory`;
  }
}
