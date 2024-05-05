import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Req,
  UseGuards,
  // HttpCode,
} from '@nestjs/common';

import { LoginLocalDto, RegisterLocalDto } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard, PlansGuard, VerifiedGuard } from '@/common/guards';
import { Plans, CurrentUser, Verified as Status } from '@/common/decorators';
import { Plan, AccountStatus } from '@/common/enums';
import { User } from '@prisma/client';
import { Request } from 'express';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  private readonly logger: Logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Post('register/local')
  async postRegisterLocal(@Body() credentials: RegisterLocalDto) {
    return this.authService.registerLocal(credentials);
  }

  @Post('login/local')
  async postLoginLocal(
    @Body() credentials: LoginLocalDto,
    @Req() req: Request,
  ) {
    return this.authService.loginLocal(credentials, req);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async PostLogout(@Req() req: Request) {
    return this.authService.logout(req);
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm')
  getConfirmAccount(@CurrentUser() user: User, @Query('token') token: string) {
    return this.authService.confirmAccount(user, token);
  }

  @Status(AccountStatus.PENDING)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Get('account/confirm-resend')
  getResendConfirmToken(@CurrentUser() user: User) {
    return this.authService.resendConfirmationToken(user);
  }

  @UseGuards(JwtAuthGuard, PlansGuard)
  @Plans(Plan.ADMIN)
  @Get('admin')
  getAdmin() {
    return '어드민 접근 경로.';
  }
}
