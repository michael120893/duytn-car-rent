import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get('profile')
  findOne(@Req() req: Request) {
    return this.usersService.findUserById(req.user['sub']);
  }

  @Patch()
  @HttpCode(204)
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(req.user['sub'], updateUserDto);
  }

  @Delete(':id')
  remove(@Req() req: Request) {
    return this.usersService.removeUser(req.user['sub']);
  }
}
