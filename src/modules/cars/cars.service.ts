import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { OrderStatus as OrderStatusEnum } from 'src/common/enums/database.enum';
import {
  AppException,
  AppExceptionBody,
} from 'src/common/exeptions/app.exception';
import { CarCapacity } from 'src/modules/cars/entities/car.capacity.entity';
import { AddCarImageDto } from './dto/add-car-image.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { GetAllCarsDto } from './dto/get-all-cars.dto';
import { Paging } from './dto/paging.dto';
import { ReviewCarDto } from './dto/review-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { CarImage } from './entities/car.image.entity';
import { CarPickupDropoff } from './entities/car.pickup.dropoff.entity';
import { CarReview } from './entities/car.review.entity';
import { CarSteering } from './entities/car.steering.entity';
import { CarType } from './entities/car.type.entity';
import { Order } from '../orders/entities/order.entity';
@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car)
    private carsModel: typeof Car,
  ) {}

  createCar(createCarDto: CreateCarDto) {
    const newCar = new Car();
    newCar.car_type_id = createCarDto.car_type_id;
    newCar.car_steering_id = createCarDto.car_steering_id;
    newCar.car_capacity_id = createCarDto.car_capacity_id;
    newCar.name = createCarDto.name;
    newCar.description = createCarDto.description;
    newCar.gasoline = createCarDto.gasoline;
    newCar.price = createCarDto.price;
    newCar.original_price = createCarDto.original_price;
    newCar.licence_plates = createCarDto.licence_plates;
    return newCar.save();
  }

  async findAllCars(getAllCarsDto: GetAllCarsDto) {
    const {
      name,
      price,
      gasoline,
      car_type_id,
      pickup_city_id,
      dropoff_city_id,
      pick_up_date,
      drop_off_date,
      limit,
      offset,
    } = getAllCarsDto;

    const result = await this.carsModel.findAndCountAll({
      attributes: {
        exclude: ['car_type_id', 'car_steering_id', 'car_capacity_id'],
      },
      include: [
        CarSteering,
        CarCapacity,
        {
          model: CarType,
          required: true,
          where: {
            ...(car_type_id && { id: car_type_id }),
          },
        },
        CarReview,
        CarImage,
        {
          model: CarPickupDropoff,
          where: {
            ...(pickup_city_id && { pickup_city_id: pickup_city_id }),
            ...(dropoff_city_id && { dropoff_city_id: dropoff_city_id }),
          },
        },
        {
          model: Order,
        },
      ],
      where: {
        ...(name && { name: { [Op.like]: `%${name}%` } }),
        ...(price && { price: { [Op.lte]: price } }),
        ...(gasoline && { gasoline: { [Op.eq]: gasoline } }),
        id: {
          [Op.notIn]: [
            Sequelize.literal(
              `(SELECT car_id from orders 
                WHERE orders.order_status_id = ${OrderStatusEnum.Renting} AND 
                  (
                    ('${pick_up_date}' BETWEEN orders.pick_up_date AND orders.drop_off_date) OR 
                    ('${drop_off_date}' BETWEEN orders.pick_up_date AND orders.drop_off_date) OR 
                    (orders.pick_up_date BETWEEN '${pick_up_date}' AND '${drop_off_date}') OR 
                    (orders.drop_off_date BETWEEN '${pick_up_date}' AND '${drop_off_date}')
                  )
                )`,
            ),
          ],
        },
      },
      limit: +limit,
      offset: +offset,
    });

    return new Paging(result.rows, {
      total: result.count,
      limit: +limit,
      offset: +offset,
    });
  }

  async findCarById(id: number): Promise<Car> {
    const car = await this.carsModel.findOne({
      include: [CarSteering, CarCapacity, CarType, CarReview, CarImage],
      where: {
        id: id,
      },
    });
    if (car) return car;

    throw AppException.notFoundException(AppExceptionBody.carNotFound());
  }

  async updateCar(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.findCarById(id);
    if (!car) {
      throw AppException.notFoundException(AppExceptionBody.carNotFound());
    }

    await this.carsModel.update(
      {
        car_type_id: updateCarDto.car_type_id,
        car_steering_id: updateCarDto.car_steering_id,
        car_capacity_id: updateCarDto.car_capacity_id,
        name: updateCarDto.name,
        description: updateCarDto.description,
        gasoline: updateCarDto.gasoline,
        price: updateCarDto.price,
        original_price: updateCarDto.original_price,
        licence_plates: updateCarDto.licence_plates,
      },
      {
        where: { id },
        returning: true,
      },
    );
  }

  async removeCar(id: number) {
    const car = await this.findCarById(id);
    if (!car) {
      throw AppException.notFoundException(AppExceptionBody.carNotFound());
    }
    this.carsModel.destroy({
      where: {
        id: id,
      },
    });
  }

  reviewCar(reviewCarDto: ReviewCarDto) {
    const carReview = new CarReview();
    carReview.user_id = reviewCarDto.user_id;
    carReview.car_id = reviewCarDto.car_id;
    carReview.rating = reviewCarDto.rating;
    carReview.comment = reviewCarDto.comment;
    return carReview.save();
  }

  addCarImage(addCarImageDto: AddCarImageDto) {
    const carImage = new CarImage();
    carImage.car_id = addCarImageDto.car_id;
    carImage.url = addCarImageDto.url;
    return carImage.save();
  }
}
