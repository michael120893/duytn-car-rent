import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './modules/cars/cars.module';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER_NAME,
} from './enviroments';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/acessToken.guard';

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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
