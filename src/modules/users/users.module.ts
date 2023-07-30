import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QueuesModule } from 'src/modules/queues/queues.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/modules/users/entities/user.entity';
import { UserAddress } from './entities/user.address.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, UserAddress]), QueuesModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
