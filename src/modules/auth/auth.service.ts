import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/common/customs/custom.exception';
import { ExceptionCode } from 'src/common/enums/exception_code';
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from 'src/enviroments';
import { UsersService } from 'src/modules/users/users.service';
import {
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from 'src/common/utils/contants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw AppException.badRequestException({
        code: ExceptionCode.BAD_REQUEST_CODE,
        title: 'Validation Error',
        message: 'Invalid email or password.',
      });
    }

    console.log('user :' + pass + ' - pass: ' + user.password);

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw AppException.badRequestException({
        code: ExceptionCode.BAD_REQUEST_CODE,
        title: 'Validation Error',
        message: 'Invalid email or password.',
      });
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
      throw AppException.forbiddenException({
        code: ExceptionCode.FORBIDDEN_CODE,
        message: 'Access Denied',
      });
    }

    const tokens = await this.getTokens(user.id, user.email);
    return tokens;
  }
}
