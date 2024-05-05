import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RedisIoModule } from './redis.io/redis.io.module';

@Module({
  imports: [AuthModule, UserModule, RedisIoModule],
})
export class V1Module {}
