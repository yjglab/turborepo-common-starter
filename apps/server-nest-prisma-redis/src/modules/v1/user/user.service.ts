import { AccountStatus } from '@/common/enums';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { uuid } from 'uuidv4';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private readonly logger: Logger = new Logger('UserService');

  public async loadUser(req: Request) {
    const user = req.user;
    return {
      user,
    };
  }

  public async createUser(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({ data });
    return user;
  }

  public async updateUser(userId: string, dto: UpdateUserDto) {
    this.prisma.user.update({
      where: {
        id: userId,
      },
      data: dto,
    });
  }

  public async loadUserByField(field: string, value: string | number) {
    const user = await this.prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
    return user;
  }

  public async createByProvider(dto, req) {
    const { provider, email } = dto;

    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ provider: { id: provider.id, name: provider.name } }, { email }],
      },
    });

    if (user) {
      if (req.user.email === user.email && user.provider.name === 'local') {
        throw new BadRequestException(
          '소셜 계정과 동일한 이메일을 가진 사용자가 이미 존재합니다.',
        );
      }
    }
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          provider: {
            name: req.user.provider.name,
            id: req.user.provider.id,
          },
          id: uuid(),
          password: req.user.password,
          email: req.user.email,
          position: req.user.position,
          plan: req.user.plan,
          displayName: req.user.displayName,
          avatar: req.user.avatar,
          status: AccountStatus.VERIFIED,
        },
      });
    }

    return user;
  }
}
