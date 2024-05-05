import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AccountStatus } from '@/common/enums';
import { JwtAuthGuard, VerifiedGuard } from '@/common/guards';
import { CurrentUser, Verified as Status } from '@/common/decorators';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Status(AccountStatus.VERIFIED)
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  @Post('update')
  postUpdateProfile(@CurrentUser('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  @SkipThrottle({ default: false })
  getLoadProfile(@Req() req: Request) {
    return this.userService.loadUser(req);
  }
}
