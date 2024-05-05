import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo(): string {
    return 'Turborepo-nest-prisma-redis';
  }
}
