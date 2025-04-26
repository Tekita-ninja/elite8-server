import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CustomersService } from './customers.service';
import {
  ClaimVisitBenefitDto,
  CreateCustomerDto,
} from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { VisitStatsDto } from './dto/stats-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @Get('stats')
  async visitStats(@Query() query: VisitStatsDto) {
    const x = await this.customersService.visitStats(query);
    return x;
  }
  @Get('top-customers')
  findTop(@Query('count') count: number) {
    return this.customersService.findTop(count);
  }

  @Post('claim-visit-benefit')
  claimVisitBenefit(@Body() dto: ClaimVisitBenefitDto) {
    return this.customersService.claimVisitBenefit(dto);
  }
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
    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Phone', key: 'phone', width: 30 },
      { header: 'Number Of Visit', key: 'numberOfVisit', width: 30 },
    ];

    const customers = await this.customersService.findAll();

    for (let i = 0; i < customers.length; i++) {
      const item = customers[i];
      worksheet.addRow({
        name: item.name,
        phone: item.phone,
        numberOfVisit: item._count.visitHistories,
      });
    }
    const headerRow = worksheet.getRow(1);
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF000000' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
        };
      });
    });
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
