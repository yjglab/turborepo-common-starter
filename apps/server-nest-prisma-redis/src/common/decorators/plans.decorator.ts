import { Plan } from '@/common/enums';
import { SetMetadata } from '@nestjs/common';

export const PLANS_KEY = 'plans';
export const Plans = (...plans: Plan[]) => SetMetadata(PLANS_KEY, plans);
