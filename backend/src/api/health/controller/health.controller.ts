import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { HealthService } from '../interface/health.service.interface';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthDto } from '../domain/dto/health.dto';
import type { FastifyReply } from 'fastify';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HEALTH_SERVICE)
    private readonly healthService: HealthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check the health of all services' })
  @ApiResponse({
    status: 200,
    description: 'All services are healthy',
    content: {
      'application/json': {
        example: {
          status: 'ok',
          services: { database: 'ok', cache: 'ok' },
        },
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'One or more services are unavailable',
    content: {
      'application/json': {
        example: {
          status: 'error',
          services: { database: 'ok', cache: 'error' },
        },
      },
    },
  })
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
