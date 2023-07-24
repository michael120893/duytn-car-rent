import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AppException } from 'src/common/customs/custom.exception';
import { AddCarImageDto } from './dto/add-car-image.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { GetAllCarsDto } from './dto/get-all-cars.dto';
import { Paging } from './dto/paging.dto';
import { ReviewCarDto } from './dto/review-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarCapacity } from 'db/models/car.capacity.entity';
import { Car } from 'db/models/car.entity';
import { CarImage } from 'db/models/car.image.entity';
import { CarReview } from 'db/models/car.review.entity';
import { CarSteering } from 'db/models/car.steering.entity';
import { CarType } from 'db/models/car.type.entity';
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
    const { name, price, gasoline, limit, offset } = getAllCarsDto;

    const whereStatment: any = {};
    if (name) {
      whereStatment.name = { [Op.like]: `%${name}%` };
    }

    if (price) {
      whereStatment.price = { [Op.lte]: price };
    }
    if (gasoline) {
      whereStatment.gasoline = { [Op.lte]: gasoline };
    }

    const result = await this.carsModel.findAndCountAll({
      attributes: {
        exclude: ['car_type_id', 'car_steering_id', 'car_capacity_id'],
      },
      include: [CarSteering, CarCapacity, CarType, CarReview, CarImage],
      where: whereStatment,
      limit: +limit,
      offset: +offset,
    });

    return new Paging(result.rows, {
      total: result.count,
      limit: +limit,
      offset: +offset,
    });
  }

  async findCar(id: number): Promise<Car> {
    const car = await this.carsModel.findOne({
      include: [CarSteering, CarCapacity, CarType, CarReview, CarImage],
      where: {
        id: id,
      },
    });
    if (car) return car;

    throw AppException.notFoundException({
      title: `Car id ${id} is not found`,
    });
  }

  async updateCar(id: number, updateCarDto: UpdateCarDto) {
    const [affectedCount, affectedRows] = await this.carsModel.update(
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
    console.log('result: ' + affectedCount + ' ' + affectedRows);
    if (!affectedRows) {
      throw AppException.notFoundException({
        title: `car_id ${id} is not found`,
      });
    }
  }

  removeCar(id: number) {
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
