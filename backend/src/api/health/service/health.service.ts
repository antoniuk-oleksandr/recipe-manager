import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/service/db.service';
import { HealthService } from '../interface/health.service.interface';
import { HealthDto } from '../domain/dto/health.dto';
import { StatusDto } from '../domain/dto/status.dto';

@Injectable()
export class HealthServiceImpl implements HealthService {
  constructor(private readonly dbService: DbService) {}

  async checkAllServices(): Promise<HealthDto> {
    const results = await Promise.all([this.checkPostgres()]);
    const status = results.every((result) => result.status === 'ok')
      ? 'ok'
      : 'error';

    const services = results.reduce<Record<string, 'ok' | 'error'>>(
      (acc, result) => {
        acc[result.name] = result.status;
        return acc;
      },
      {},
    );

    return {
      status,
      services,
    };
  }

  async checkPostgres(): Promise<StatusDto> {
    const name = 'postgres';
    try {
      await this.dbService.db.$client.query(`SELECT 1`);
      return { name, status: 'ok' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { name, status: 'error' };
    }
  }
}
