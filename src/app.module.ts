import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';

import appConfig from './config/app.config';
import mongoConfig from './config/mongo.config';

import { ProjectsModule } from './modules/projects/projects.module';
import { TestsModule } from './modules/tests/tests.module';

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
  ],
})
export class AppModule {}