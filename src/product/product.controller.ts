import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { ProductService } from './product.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get Products with FIltering & Pagination' })
  async getProducts(@Query() query: GetProductsDto, @Res() res: Response) {
    const data = await this.productService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      data,
    });
  }

  @Get('changes')
  @ApiOperation({ summary: "Track Products' Changes" })
  async trackProducts(@Res() res: Response) {
    const products = await this.productService.getChangedProducts();
    return res.status(HttpStatus.OK).json({
      success: true,
      data: products,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Product By ID' })
  async getProductById(@Param('id') id: string, @Res() res: Response) {
    const product = await this.productService.getById(id);
    return res.status(HttpStatus.OK).json({
      success: true,
      data: product,
    });
  }
}
