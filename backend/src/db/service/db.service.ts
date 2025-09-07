import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
  private _db: ReturnType<typeof drizzle>;

  onModuleInit() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this._db = drizzle(pool);
  }

  async onModuleDestroy() {
    await this._db.$client.end();
  }

  get db() {
    return this._db;
  }
}
