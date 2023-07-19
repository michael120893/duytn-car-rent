import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarCapacity } from 'models/car.capacity.entity';
import { CarImage } from 'models/car.image.entity';
import { CarReview } from 'models/car.review.entity';
import { CarSteering } from 'models/car.steering.entity';
import { CarType } from 'models/car.type.entity';
import { Car } from 'models/car.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Car, CarCapacity, CarType, CarReview, CarImage, CarSteering]),
  ],
  controllers: [CarsController],
  providers: [CarsService]
})
export class CarsModule {}
