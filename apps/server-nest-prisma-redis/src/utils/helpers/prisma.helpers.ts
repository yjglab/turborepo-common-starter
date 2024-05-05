import { Prisma } from '@prisma/client';

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}

export function fieldExclude(data: object, keys: string[]) {
  for (const key of keys) {
    delete data[key];
  }
}

export function calcDate(date: Date, opt: 'set' | 'get') {
  if (opt === 'set') {
    return new Date(date.getTime() + 32400000); // +9h
  } else if (opt === 'get') {
    return new Date(date.getTime() - 32400000); // +9h
  }
}

/*
 async findById(id: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      select: prismaExclude('User', ['password']),
    });
    return user;
  }
 */
