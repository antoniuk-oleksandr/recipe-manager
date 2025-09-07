import { HealthDto } from '../domain/dto/health.dto';
import { StatusDto } from '../domain/dto/status.dto';

export interface HealthService {
  checkAllServices(): Promise<HealthDto>;
  checkPostgres(): Promise<StatusDto>;
}
