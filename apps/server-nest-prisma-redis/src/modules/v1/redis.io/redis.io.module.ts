import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/v1/user/user.module';
import { AuthModule } from '@/modules/v1/auth/auth.module';
import { RedisIoService } from './redis.io.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [RedisIoService],
})
export class RedisIoModule {}
