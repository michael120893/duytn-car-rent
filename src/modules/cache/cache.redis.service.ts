import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JWT_ACCESS_TOKEN_EXPIRES_IN } from 'src/common/utils/contants';
import { expiresInToSeconds } from 'src/common/utils/methods';
@Injectable()
export class CacheRedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setTokenToBlackList(token: string) {
    await this.cacheManager.set(token, {
      ttl: expiresInToSeconds(JWT_ACCESS_TOKEN_EXPIRES_IN),
    });
  }

  async isTokenInBlackList(token: string): Promise<boolean> {
    return !!(await this.cacheManager.get<String>(token));
  }
}
