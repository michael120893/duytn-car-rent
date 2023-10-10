import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT } from 'src/enviroments';
import { EMAIL_QUEUE } from 'src/common/utils/contants';
import { QueueConsumer } from './queues.comsumer';
import { QueueService } from './queues.service';

@Module({
  imports: [
    // BullModule.forRoot({
    //   redis: {
    //     host: REDIS_HOST,
    //     port: REDIS_PORT,
    //     username: 'car-rent', // new property
    //   password: 'qejkdl6WTeoslHeUDGQ0EQzVTLaEUhA4', // new property
    //   },
    // }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
  ],
  providers: [QueueService, QueueConsumer],
  exports: [QueueService],
})
export class QueuesModule {}
