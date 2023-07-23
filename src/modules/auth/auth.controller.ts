import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { Request } from 'express';
import { SkipAuth } from 'src/common/guards/acessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @SkipAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @UsePipes(new CustomValidationPipe())
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @SkipAuth()
  @Post('login')
  signIn(@Body() signInDto: CreateAuthDto) {
    return this.authService.login(signInDto.username, signInDto.password);
  }

  @Get('profile')
  getProfile(@Req() req: Request): any {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
