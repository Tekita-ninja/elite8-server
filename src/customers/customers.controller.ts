import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('delete')
  @HttpCode(200)
  deleteMany(@Body('ids') ids: string[]) {
    return this.customersService.deleteMany(ids);
  }
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get('export')
  async export(@Res() res: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TestExportXLS');

    worksheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Phone', key: 'phone' },
    ];

    const customers = await this.customersService.findAll();

    for (let i = 0; i < customers.length; i++) {
      const item = customers[i];
      worksheet.addRow({
        name: item.name,
        phone: item.phone,
      });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    res.header(
      'Content-Disposition',
      'attachment; filename=anlikodullendirme.xlsx',
    );
    res.type(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
  @Get('all')
  findAll() {
    return this.customersService.findAll();
  }
  @Get('phone/:phone')
  findOneByPhone(@Param('phone') phone: string) {
    return this.customersService.findOneByPhone(phone);
  }

  @Get()
  findPaginate(@Query() query: any) {
    return this.customersService.findPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
