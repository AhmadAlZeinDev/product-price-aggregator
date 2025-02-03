import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiOperation({ summary: 'Health Check' })
  healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).send('Healthy');
  }
}
