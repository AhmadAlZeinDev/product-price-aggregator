import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Provider } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CronProductService {
  private readonly logger = new Logger('CronProduct');
  constructor(private prisma: PrismaService) {}

  // Cron Job to sync products will run every 15 minutes (I chose this duration for testing)
  // I want to mention here that I went with Cron Job solutions to handle data freshness
  // for performance reasons that we can discuss about it
  // Is this best technique ? from my point-of-view yes, but needs some enhancements
  // Like we should have socket to handle the data updates so in this case we can update in real time
  // instead of updating after specific time
  // And we can use webhooks so in this case instead of keeping real time connection and handling
  // the connection fails, the external providers can call this webhooks to update data
  @Cron('0 */15 * * * *')
  async syncProducts() {
    try {
      const date = new Date();
      const primaryProvider = `${process.env.PRIMARY_PROVIDER_BASE_URL}/products`;
      const secondaryProvider = `${process.env.SECONDARY_PROVIDER_BASE_URL}/products`;
      const tertiaryProvider = `${process.env.TERTIARY_PROVIDER_BASE_URL}/products`;

      // Call the 3 external APIs at same time
      const [primary, secondary, tertiary] = await Promise.all([
        fetch(primaryProvider).then((response) => response.json()),
        fetch(secondaryProvider).then((response) => response.json()),
        fetch(tertiaryProvider).then((response) => response.json()),
      ]);

      const allProducts = [
        ...primary.map((product) =>
          this.processProduct(product, Provider.PRIMARY),
        ),
        ...secondary.map((product) =>
          this.processProduct(product, Provider.SECONDARY),
        ),
        ...tertiary.map((product) =>
          this.processProduct(product, Provider.TERTIARY),
        ),
      ];

      for (const product of allProducts) {
        const existingProduct = await this.prisma.product.findUnique({
          where: { id: product.id },
        });

        if (existingProduct) {
          await this.prisma.product.update({
            where: { id: product.id },
            data: {
              name: product.name,
              description: product.description,
              price: product.price,
              currency: product.currency,
              availability: product.availability,
              updatedAt: new Date(),
            },
          });
          this.logger.log(`Product updated: ${product.id} at ${date}`);
        } else {
          await this.prisma.product.create({
            data: product,
          });
          this.logger.log(`Product created: ${product.id} at ${date}`);
        }
      }
    } catch (e) {
      this.logger.error('Sync Products Cron Job failed', e);
    }
  }

  private processProduct(product: any, provider: Provider) {
    return {
      id: `${provider}_${product.id}`,
      name: product.name,
      description: product?.description,
      price: product.price,
      currency: product.currency || 'USD',
      availability: product.availability,
      provider,
      updatedAt: new Date(),
    };
  }
}
