import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';
import { PLANS_KEY } from '../decorators';
import { Plan } from '../enums';

@Injectable()
export class PlansGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPlans = this.reflector.getAllAndMerge<Plan[]>(PLANS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPlans) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();

    return user && requiredPlans.some((plan) => user.plan.name?.includes(plan));
  }
}
