import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/modules/queues/queues.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UserInfo } from './entities/user.info.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, UserInfo]), QueuesModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
