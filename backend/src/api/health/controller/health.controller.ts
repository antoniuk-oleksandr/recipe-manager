import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import type { HealthService } from '../interface/health.service.interface';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthDto } from '../domain/dto/health.dto';
import type { FastifyReply } from 'fastify';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HEALTH_SERVICE)
    private readonly healthService: HealthService,
  ) {}

  @Get()
  async healthCheck(
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<HealthDto> {
    const health = await this.healthService.checkAllServices();

    if (health.status === 'error') {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return health;
  }
}
