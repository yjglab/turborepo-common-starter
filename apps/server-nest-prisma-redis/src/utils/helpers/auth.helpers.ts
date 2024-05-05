import * as bcrypt from 'bcrypt';

const hash = async (text: string) => {
  return await bcrypt.hash(text, 11);
};

const hashVerified = async (text: string, hashedText: string) => {
  return bcrypt.compare(text, hashedText);
};

export const AuthHelpers = {
  hash,
  hashVerified,
};
