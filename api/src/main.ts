import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true }));
  await app.listen(process.env.PORT || 3000);
  console.log(`API escuchando en puerto ${process.env.PORT || 3000}`);
}
bootstrap();
