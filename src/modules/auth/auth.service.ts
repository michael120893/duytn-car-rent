import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  AppException,
  AppExceptionBody,
} from 'src/common/exeptions/app.exception';
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from 'src/common/utils/contants';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from 'src/enviroments';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw AppException.badRequestException(
        AppExceptionBody.invalidEmailOrPassword(),
      );
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw AppException.badRequestException(
        AppExceptionBody.invalidEmailOrPassword(),
      );
    }
    const tokens = await this.getTokens(user.id, user.name);
    return tokens;
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          name: username,
        },
        {
          secret: JWT_ACCESS_SECRET,
          expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          name: username,
        },
        {
          secret: JWT_REFRESH_SECRET,
          expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    console.log(user + ' - ' + userId);
    if (!user) {
      throw AppException.forbiddenException(AppExceptionBody.userNotFound());
    }

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }
}
