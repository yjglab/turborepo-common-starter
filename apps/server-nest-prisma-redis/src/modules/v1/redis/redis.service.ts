import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '@/modules/v1/auth/auth.service';

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger('RedisService');
  constructor(private readonly authService: AuthService) {}

  async loadUserFromSocket(socket: Socket) {
    try {
      const cookie = socket.handshake.headers.cookie;

      if (!cookie) {
        throw new WsException('[COOKIE ERR] 쿠키를 찾을 수 없습니다.');
      }

      const { access_token: accessToken } = parse(cookie);
      const user = await this.authService.loadUserFromAccessToken(accessToken);

      if (!user) {
        throw new WsException('Invalid credentials');
      }

      return user;
    } catch (err) {}
  }
}
