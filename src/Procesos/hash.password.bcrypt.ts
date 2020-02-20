import { genSalt, hash } from 'bcryptjs';
import { inject } from '@loopback/core';

interface passwordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
}

export class BcyptHasher implements passwordHasher<string>{
  @inject('rounds')
  public readonly round: number

  async hashPassword(password: string) {
    const salt = await genSalt(this.round);
    return await hash(password, salt);
  }

}
