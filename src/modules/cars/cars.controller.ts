import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CarsService } from './cars.service';
import { AddCarImageDto } from './dto/add-car-image.dto';
import { CreateCarDto } from './dto/create-car.dto';
import { GetAllCarsDto } from './dto/get-all-cars.dto';
import { ReviewCarDto } from './dto/review-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UsePipes(new CustomValidationPipe())
  createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.createCar(createCarDto);
  }

  @Post('reviews')
  @UsePipes(new CustomValidationPipe())
  reviewCar(@Body() reviewCarDto: ReviewCarDto) {
    return this.carsService.reviewCar(reviewCarDto);
  }

  @Get()
  async findAllCar(@Query() getAllCarsDto: GetAllCarsDto) {
    return await this.carsService.findAllCars(getAllCarsDto);
  }

  @Get(':id')
  findCar(@Param('id') id: number) {
    return this.carsService.findCar(id);
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.updateCar(+id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.carsService.removeCar(id);
  }

  @Post('images')
  @UsePipes(new CustomValidationPipe())
  addCarImage(@Body() addCarImageDto: AddCarImageDto) {
    return this.carsService.addCarImage(addCarImageDto);
  }
}
