import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  page?: number = 1;
}
