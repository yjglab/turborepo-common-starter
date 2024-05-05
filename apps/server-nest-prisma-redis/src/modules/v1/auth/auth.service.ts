import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PlanName, User } from '@prisma/client';

import { LoginLocalDto, RegisterLocalDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import { uuid } from 'uuidv4';
import { UserService } from '@/modules/v1/user/user.service';
import { AccountStatus, Providers } from '@/common/enums';
import { AuthHelpers } from '@/utils/helpers/auth.helpers';
import { SocialProvider } from '@/common/exceptions';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('AuthService');

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectQueue('mail-queue') private mailQueue: Queue,
  ) {}

  public async registerLocal(dto: RegisterLocalDto) {
    try {
      const { email, displayName, password, position } = dto;

      const user = await this.userService.createUser({
        provider: {
          name: Providers.Local,
          id: '',
        },
        id: uuid(),
        email,
        displayName,
        password,
        position,
        plan: {
          name: 'free' as PlanName,
          expire: '',
        },
      });

      await this.sendConfirmationToken(user);

      return true;
    } catch (err) {
      if (err.meta.target.includes('email')) {
        throw new BadRequestException({
          email: '이미 존재하는 이메일 계정입니다.',
        });
      }
      if (err.meta.target.includes('displayName')) {
        throw new BadRequestException({
          displayName: '이미 존재하는 표시 이름입니다.',
        });
      }
      throw new InternalServerErrorException('Register Error');
    }
  }

  public async loginLocal(dto: LoginLocalDto, req: Request) {
    try {
      const { email, password } = dto;

      const user = await this.loadVerifiedUser(email, password);
      const [accessToken, refreshToken] = await this.generateTokens(user);

      await this.setTokens(req, { accessToken, refreshToken });

      return {
        user,
        accessToken,
      };
    } catch (err) {
      this.logger.debug(err);
      throw new HttpException(err.response, err.status);
    }
  }

  public async loadVerifiedUser(email: string, password: string) {
    try {
      const user = await this.userService.loadUserByField('email', email);
      if (!user) {
        throw new BadRequestException({
          email: '존재하지 않는 계정입니다.',
        });
      }
      if (user.provider.name !== Providers.Local) {
        throw new SocialProvider();
      }
      const isMatch = await AuthHelpers.hashVerified(password, user.password);
      if (!isMatch) {
        throw new BadRequestException({
          password: '비밀번호가 일치하지 않습니다.',
        });
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  public async logout(req: Request) {
    if (req.cookies && req.cookies['refresh_token']) {
      const refreshTokenCookie = req.cookies['refresh_token'];
      const verifiedRefresh = await this.jwtService.verifyAsync(
        refreshTokenCookie,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        },
      );
      await this.redisService
        .getClient()
        .del(`refresh-token:${verifiedRefresh.id}:${verifiedRefresh.jti}`);
    }
    req.res.clearCookie('access_token');
    req.res.clearCookie('refresh_token');
  }

  private async generateTokens(user: User) {
    const jwtid = nanoid();

    const accessToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        issuer: 'Nebaram',
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        displayName: user.displayName,
        id: user.id,
      },
      {
        jwtid,
        issuer: 'Nebaram',
        secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      },
    );
    this.logger.log(`refresh-token:${user.id}:${jwtid}`);
    await this.redisService.getClient().set(
      `refresh-token:${user.id}:${jwtid}`,
      user.id,
      'EX',
      60 * 60 * 24 * 30, // 30d
    );

    return [accessToken, refreshToken];
  }

  private async setTokens(
    req: Request,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken?: string },
  ) {
    req.res.cookie('access_token', accessToken, {
      maxAge: 1000 * 60 * 60 * 1,
      httpOnly: true,
      sameSite: 'lax',
    });

    if (refreshToken) {
      req.res.cookie('refresh_token', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: true,
      });
    }
  }

  private async generateGravatarUrl(email: string) {
    const hashedEmail = await AuthHelpers.hash(email);
    return `https://www.gravatar.com/avatar/${hashedEmail}`;
  }

  private async sendConfirmationToken(user: User) {
    const token = nanoid();

    await this.redisService
      .getClient()
      .set(`confirm-account:${token}`, user.id, 'EX', 900); // 토큰 만료까지 15분

    await this.mailQueue.add('confirm', { user, token });
  }

  public async confirmAccount(user: User, token: string) {
    const accountId = await this.redisService
      .getClient()
      .get(`confirm-account:${token}`);

    if (!accountId) {
      if (accountId === user.id && user.status === AccountStatus.VERIFIED) {
        return {
          success: true,
          message: '이미 인증이 확인된 계정입니다.',
        };
      }

      return {
        success: false,
        message: '이메일 확인 코드가 만료되었습니다. 다시 시도해주세요',
      };
    }

    if (user.id === accountId) {
      await this.userService.updateUser(user.id, {
        status: AccountStatus.VERIFIED,
      });

      await this.redisService.getClient().del(`confirm-account:${token}`);
    }
    return {
      success: true,
      message: '이메일이 확인되었습니다. 이제 서비스를 이용할 수 있습니다.',
    };
  }

  public async resendConfirmationToken(user: any) {
    this.sendConfirmationToken(user);

    return {
      success: true,
      message: '계정 확인 코드가 다시 전송되었습니다. 이메일을 확인해주세요',
    };
  }

  public async verifyAccessToken(token: string) {
    const verifiedJWT = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
    });

    if (!verifiedJWT) {
      return true;
    }
    return false;
  }

  public async refreshTokens(req: Request) {
    const refreshTokenCookie = req.cookies['refresh_token'];
    if (!refreshTokenCookie) {
      throw new UnauthorizedException(
        '[REFRESH TOKEN ERR] 리프레시 토큰이 만료되었거나 유효하지 않습니다.',
      );
    }

    const verifiedJWT = await this.jwtService.verifyAsync(refreshTokenCookie, {
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });
    if (!verifiedJWT) {
      throw new UnauthorizedException(
        '[ACCESS TOKEN ERR] 토큰이 만료되었거나 유효하지 않습니다.',
      );
    }

    const refreshTokenRedis = await this.redisService
      .getClient()
      .get(`refresh-token:${verifiedJWT.id}:${verifiedJWT.jti}`);

    if (!refreshTokenRedis) {
      throw new UnauthorizedException(
        '[REFRESH TOKEN ERR] 리프레시 토큰을 찾을 수 없습니다.',
      );
    }

    const accessToken = await this.jwtService.signAsync(
      {
        displayName: verifiedJWT.displayName,
        id: verifiedJWT.id,
      },
      {
        issuer: 'Nebaram',
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
      },
    );

    await this.setTokens(req, { accessToken });
    const user = await this.userService.loadUserByField('id', verifiedJWT.id);
    return user;
  }

  public async loadUserFromAccessToken(token: string) {
    const verifiedJWT = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
    });

    if (!verifiedJWT) {
      return undefined;
    }

    return this.userService.loadUserByField('id', verifiedJWT.id);
  }
}
