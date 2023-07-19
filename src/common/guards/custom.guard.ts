import {
    CanActivate,
    ExecutionContext,
    Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AppException } from 'src/common/customs/custom.exception';
import { ExceptionCode } from '../enums/exception_code';
import { JWT_ACCESS_SECRET } from 'src/enviroments';

@Injectable()
export class CustomAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw AppException.unauthorizedException(
                {
                    code: ExceptionCode.FORBIDDEN_CODE,
                    message: 'Unauthorized',
                }
            )
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: JWT_ACCESS_SECRET,
                }
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            throw AppException.unauthorizedException(
                {
                    code: ExceptionCode.FORBIDDEN_CODE,
                    message: 'Unauthorized',
                }
            )
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}