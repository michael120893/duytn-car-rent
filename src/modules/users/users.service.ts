import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/common/customs/custom.exception';
import { ExceptionCode } from 'src/common/enums/exception_code';
import { User } from '../../../models/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const userRequest = createUserDto;
      userRequest.password = await bcrypt.hash(createUserDto.password, salt);
      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.name = createUserDto.name;
      newUser.password = createUserDto.password;
      newUser.phone = createUserDto.phone;
      newUser.avatar_url = createUserDto.avatar_url;
      const { password, ...result } = (await newUser.save()).get({
        plain: true,
      });
      return result;
    } catch (err) {
      if (
        typeof err?.original?.code !== 'undefined' &&
        err.original.code === 'ER_DUP_ENTRY'
      ) {
        throw AppException.conflictException({
          code: ExceptionCode.VALIDATION_CODE,
          title: 'Validation Error',
          message: err.errors[0].message,
        });
      }
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
