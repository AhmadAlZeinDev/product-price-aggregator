import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@prisma/client';

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              count: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getAll', () => {
    it('should return paginated products with filters', async () => {
      const filter = {
        name: 'test',
        fromPrice: 10,
        toPrice: 100,
        availability: 'in_stock',
        provider: Provider.PRIMARY,
        page: 1,
        limit: 10,
      };

      const mockProducts = [
        {
          id: '1',
          name: 'test product',
          description: 'test description',
          price: 50,
          currency: 'USD',
          provider: Provider.PRIMARY,
          availability: 'in_stock',
          updatedAt: new Date(),
        },
      ];
      const mockCount = 1;

      jest.spyOn(prismaService.product, 'count').mockResolvedValue(mockCount);
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValue(mockProducts);

      const result = await service.getAll(filter);

      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: {
          name: { endsWith: '%test%', mode: 'insensitive' },
          price: { gte: 10, lte: 100 },
          availability: 'in_stock',
          provider: Provider.PRIMARY,
        },
      });
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { endsWith: '%test%', mode: 'insensitive' },
          price: { gte: 10, lte: 100 },
          availability: 'in_stock',
          provider: Provider.PRIMARY,
        },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        products: mockProducts,
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
        totalItems: mockCount,
      });
    });
  });

  describe('getById', () => {
    it('should return a product if it exists', async () => {
      const mockProduct = {
        id: '1',
        name: 'test product',
        description: 'test description',
        price: 50,
        currency: 'USD',
        provider: Provider.PRIMARY,
        availability: 'in_stock',
        updatedAt: new Date(),
      };
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(mockProduct);

      const result = await service.getById('1');

      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw an error if product does not exist', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.getById('1')).rejects.toThrow(
        new HttpException('Product not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getChangedProducts', () => {
    it('should return products updated within the change interval', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'test product',
          description: 'test description',
          price: 50,
          currency: 'USD',
          provider: Provider.PRIMARY,
          availability: 'in_stock',
          updatedAt: new Date(),
        },
      ];
      const mockChangeInterval = 120;

      jest.spyOn(configService, 'get').mockReturnValue(mockChangeInterval);
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockResolvedValue(mockProducts);

      const result = await service.getChangedProducts();

      const expectedDate = new Date();
      expectedDate.setMinutes(expectedDate.getMinutes() - mockChangeInterval);

      expect(configService.get).toHaveBeenCalledWith('CHANGES_INTERVAL');
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          updatedAt: {
            gte: expectedDate,
          },
        },
      });
      expect(result).toEqual(mockProducts);
    });
  });
});
