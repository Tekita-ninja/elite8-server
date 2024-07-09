import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('client/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  searchProduct(@Query() query: any) {
    return this.productService.findAll(query);
  }
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productService.findOne(slug);
  }
}
