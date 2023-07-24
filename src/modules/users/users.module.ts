import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/queues/queues.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'db/models/user.entity';
import { UserInfo } from 'db/models/user.info.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, UserInfo]), QueuesModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
