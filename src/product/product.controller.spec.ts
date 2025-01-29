import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { GetProductsDto } from './dto/get-products.dto';
import { Provider } from '@prisma/client';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAll: jest.fn(),
            getById: jest.fn(),
            getChangedProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('getProducts', () => {
    it('should return products with filtering and pagination', async () => {
      const query: GetProductsDto = {
        page: 1,
        limit: 10,
        name: 'test',
        fromPrice: 10,
        toPrice: 100,
        availability: 'in_stock',
        provider: 'PRIMARY',
      };
      const mockData = {
        products: [
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
        ],
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
        totalItems: 1,
      };
      const res = mockResponse();

      jest.spyOn(productService, 'getAll').mockResolvedValue(mockData);

      await controller.getProducts(query, res);

      expect(productService.getAll).toHaveBeenCalledWith(query);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockData,
      });
    });
  });

  describe('trackProducts', () => {
    it('should return changed products', async () => {
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
      const res = mockResponse();

      jest
        .spyOn(productService, 'getChangedProducts')
        .mockResolvedValue(mockProducts);

      await controller.trackProducts(res);

      expect(productService.getChangedProducts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
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
      const res = mockResponse();

      jest.spyOn(productService, 'getById').mockResolvedValue(mockProduct);

      await controller.getProductById('1', res);

      expect(productService.getById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
      });
    });

    it('should throw an error if product is not found', async () => {
      const res = mockResponse();
      const error = new Error('Product not found');

      jest.spyOn(productService, 'getById').mockRejectedValue(error);

      await expect(controller.getProductById('1', res)).rejects.toThrow(error);
    });
  });
});
