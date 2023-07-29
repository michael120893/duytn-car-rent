import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly winstonLogger: LoggerService,
  ) {}

  private maskJSONOptions = {
    maskWith: '*',
    maxMaskedCharactersStr: 8,
    fields: ['password', 'authorization', 'email'],
  };

  private logger = new Logger();

  private MaskData = require('maskdata');

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const statusCode = res.statusCode;

      const maskedReqBody = this.MaskData.maskJSONFields(
        req.body,
        this.maskJSONOptions,
      );
      const maskedHeader = this.MaskData.maskJSONFields(
        req.headers,
        this.maskJSONOptions,
      );

      const message = `${new Date().toISOString()} ${req.method} ${
        req.url
      } ${JSON.stringify(maskedReqBody)} ${
        res.statusCode
      } headers=${JSON.stringify(maskedHeader)}`;

      if (statusCode >= 500) {
        this.logger.error(message);
        this.winstonLogger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
        this.winstonLogger.warn(message);
      } else {
        this.logger.log(message);
        this.winstonLogger.log(message);
      }
    });

    next();
  }
}
