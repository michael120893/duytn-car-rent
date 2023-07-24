import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_ACCESS_SECRET } from 'src/enviroments';
import { CacheRedisService } from 'src/modules/cache/cache.redis.service';
import { AppException } from '../customs/custom.exception';
import { ExceptionCode } from '../enums/exception_code';

type JwtPayload = {
  sub: string;
  username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly cacheService: CacheRedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    if (await this.cacheService.isTokenInBlackList(accessToken)) {
      throw AppException.unauthorizedException({
        code: ExceptionCode.FORBIDDEN_CODE,
        message: 'Unauthorized',
      });
    }
    return { ...payload, accessToken };
  }
}
