import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarCapacity } from 'db/models/car.capacity.entity';
import { Car } from 'db/models/car.entity';
import { CarImage } from 'db/models/car.image.entity';
import { CarReview } from 'db/models/car.review.entity';
import { CarSteering } from 'db/models/car.steering.entity';
import { CarType } from 'db/models/car.type.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Car,
      CarCapacity,
      CarType,
      CarReview,
      CarImage,
      CarSteering,
    ]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
