import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.listen({ port: Number(process.env.PORT) || 3000 });
}

bootstrap();
