import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getAll(filter: GetProductsDto) {
    const whereFilter: any = {
      ...(filter.name && {
        name: {
          endsWith: `%${filter.name}%`,
          mode: 'insensitive',
        },
      }),
      ...((filter?.fromPrice || filter?.toPrice) && {
        price: {
          ...(filter.fromPrice && { gte: filter.fromPrice }),
          ...(filter.toPrice && { lte: filter.toPrice }),
        },
      }),
      ...(filter.availability && { availability: filter.availability }),
      ...(filter.provider && { provider: filter.provider }),
    };
    const productsCount = await this.prisma.product.count({
      where: whereFilter,
    });
    const products = await this.prisma.product.findMany({
      where: whereFilter,
      skip: (filter.page - 1) * filter.limit,
      take: filter.limit,
    });
    const totalPages = Math.ceil(productsCount / filter.limit);
    return {
      products,
      pageSize: filter.limit,
      currentPage: filter.page,
      totalPages,
      totalItems: productsCount,
    };
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    return product;
  }

  async getChangedProducts() {
    const changeInterval =
      this.configService.get<number>('CHANGES_INTERVAL') || 120; // By default 120 minutes = 2 hours
    const date = new Date();
    date.setMinutes(date.getMinutes() - changeInterval);
    return await this.prisma.product.findMany({
      where: {
        updatedAt: {
          gte: date,
        },
      },
    });
  }
}
