import {genSalt, hash, compare} from 'bcryptjs';
import {inject} from '@loopback/core';
import {PasswordHasherBindings} from '../keys';

export interface passwordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcyptHasher implements passwordHasher<string> {
  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordMatch = await compare(providedPass, storedPass);
    return passwordMatch;
  }
  @inject(PasswordHasherBindings.ROUNDS)
  public readonly round: number;

  async hashPassword(password: string) {
    const salt = await genSalt(this.round);
    return await hash(password, salt);
  }
}
