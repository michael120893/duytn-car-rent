import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenGuard } from './common/guards/acessToken.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER_NAME,
} from './enviroments';
import { AuthModule } from './modules/auth/auth.module';
import { CacheRedisModule } from './modules/cache/cache.redis.module';
import { CarsModule } from './modules/cars/cars.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { QueuesModule } from './modules/queues/queues.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      username: DATABASE_USER_NAME,
      password: DATABASE_PASSWORD,
      database: DATABASE_NAME,
      autoLoadModels: true,
      synchronize: false,
    }),
    UsersModule,
    CarsModule,
    AuthModule,
    PaymentsModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({
            level: 'info',
            filename: 'logs/application.log',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
      }),
    }),
    QueuesModule,
    CacheRedisModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
