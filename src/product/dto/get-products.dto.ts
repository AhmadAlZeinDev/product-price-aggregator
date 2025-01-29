import { ApiPropertyOptional } from '@nestjs/swagger';
import { Provider } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class GetProductsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: Number, required: false })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  fromPrice?: number;

  @ApiPropertyOptional({ type: Number, required: false })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @IsOptional()
  toPrice?: number;

  @ApiPropertyOptional({ type: String, required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  availability?: string;

  @ApiPropertyOptional({ enum: Provider, required: false })
  @IsEnum(Provider)
  @IsNotEmpty()
  @IsOptional()
  provider?: Provider;
}
