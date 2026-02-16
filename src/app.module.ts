
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import appConfig from './config/app.config';
import mongoConfig from './config/mongo.config';

import { ProjectsModule } from './modules/projects/projects.module';
import { TestsModule } from './modules/tests/tests.module';
import { HealthModule } from './modules/health/health.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig],
    }),
    LoggerModule.forRoot(),

    MongooseModule.forRootAsync({
      useFactory: mongoConfig,
    }),

    ProjectsModule,
    TestsModule,
    HealthModule,
    SeedModule, // <- теперь SeedService доступен
  ],
})
export class AppModule {}