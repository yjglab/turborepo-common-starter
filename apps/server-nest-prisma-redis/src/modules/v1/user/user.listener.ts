import { AuthHelpers } from '@/utils/helpers/auth.helpers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserListener {
  static async onCreated(params, next) {
    if (params.model == 'User') {
      if (params.action === 'create') {
        const email = params.args['data'].email;
        const password = params.args['data'].password;

        const hashedPassword = await AuthHelpers.hash(password);
        params.args['data'] = {
          ...params.args['data'],
          email,
          password: hashedPassword,
        };
      }
    }

    return next(params);
  }
}
