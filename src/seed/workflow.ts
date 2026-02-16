import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  await seedService.run();
  await app.close();
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});
