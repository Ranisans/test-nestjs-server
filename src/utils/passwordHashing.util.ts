import * as bcrypt from 'bcrypt';
import { ROUNDS } from 'constants/authentication';

export const passwordHashing = (plainTextPassword): Promise<string> =>
  bcrypt.hash(plainTextPassword, ROUNDS);
