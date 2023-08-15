import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { CacheRedisService } from '../cache/cache.redis.service';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { SkipAuth } from 'src/common/decorators/skip.auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly cacheRedisService: CacheRedisService,
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
  login(@Body() signInDto: CreateAuthDto) {
    return this.authService.login(signInDto.username, signInDto.password);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Req() req: Request) {
    return this.cacheRedisService.setTokenToBlackList(req.user['accessToken']);
  }

  @Get('profile')
  getProfile(@Req() req: Request): any {
    return req.user;
  }

  @SkipAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const userRole = req.user['role'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken, userRole);
  }
}
