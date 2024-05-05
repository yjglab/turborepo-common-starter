import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { ACCOUNT_KEY } from '../decorators';
import { AccountStatus } from '../enums';

@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const accountStatus = this.reflector.get<AccountStatus>(
      ACCOUNT_KEY,
      context.getHandler(),
    );

    if (!accountStatus) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (
      accountStatus !== user.status &&
      user.status === AccountStatus.VERIFIED
    ) {
      throw new HttpException(
        {
          statusCode: 200,
          message: 'Account is already verified',
          success: true,
        },
        HttpStatus.OK,
      );
    }

    if (
      accountStatus !== user.status &&
      user.status !== AccountStatus.VERIFIED
    ) {
      throw new HttpException(
        { statusCode: 403, message: `You aren't verified`, success: false },
        HttpStatus.OK,
      );
    }

    return user && accountStatus === user.status;
  }
}
