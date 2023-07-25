import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { AppException } from 'src/common/customs/custom.exception';
import { ExceptionCode } from 'src/common/enums/exception_code';
import { QueueService } from 'src/modules/queues/queues.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly queueService: QueueService,
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

      this.queueService.sendRegisterAccountMail(
        createUserDto.email,
        createUserDto.name,
        createUserDto.phone,
      );
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

  findAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  findUserById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });
  }

  findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        email: email,
      },
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw AppException.notFoundException({
        title: `user_id ${id} is not found`,
      });
    }

    await this.userModel.update(
      {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        avatar_url: updateUserDto.avatar_url,
      },
      {
        where: { id },
        returning: true,
      },
    );
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw AppException.notFoundException({
        title: `user_id ${id} is not found`,
      });
    }

    this.userModel.destroy({
      where: {
        id: id,
      },
    });
  }
}
