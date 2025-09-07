import 'dotenv/config';
import { defineConfig as drizzleConfig } from 'drizzle-kit';

export default drizzleConfig({
  out: './drizzle',
  schema: ['./src/db/tables/*.ts', './src/db/enums/*.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
