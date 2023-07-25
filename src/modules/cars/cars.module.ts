import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CarCapacity } from 'src/modules/cars/entities/car.capacity.entity';
import { Car } from './entities/car.entity';
import { CarImage } from './entities/car.image.entity';
import { CarReview } from './entities/car.review.entity';
import { CarSteering } from './entities/car.steering.entity';
import { CarType } from './entities/car.type.entity';

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
