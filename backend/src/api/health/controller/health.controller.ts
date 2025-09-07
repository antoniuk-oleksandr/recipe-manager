import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { HealthService } from '../interface/health.service.interface';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthDto } from '../domain/dto/health.dto';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(HEALTH_SERVICE)
    private readonly healthService: HealthService,
  ) {}

  @Get()
  async healthCheck(): Promise<HealthDto> {
    const health = await this.healthService.checkAllServices();
    if (health.status === 'error') {
      throw new ServiceUnavailableException(health);
    }

    return health;
  }
}
