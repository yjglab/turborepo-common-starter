import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/v1/user/user.module';
import { AuthModule } from '@/modules/v1/auth/auth.module';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [AuthModule, UserModule],
  providers: [RedisService],
})
export class RedisModule {}
