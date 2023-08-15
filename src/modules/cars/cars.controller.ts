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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
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
  @Roles(Role.Admin)
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
    return this.carsService.findCarById(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.updateCar(+id, updateCarDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: number) {
    return this.carsService.removeCar(id);
  }

  @Post('images')
  @UsePipes(new CustomValidationPipe())
  @Roles(Role.Admin)
  addCarImage(@Body() addCarImageDto: AddCarImageDto) {
    return this.carsService.addCarImage(addCarImageDto);
  }
}
