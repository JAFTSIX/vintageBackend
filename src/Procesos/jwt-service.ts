import {UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);

export class JwtService {
  @inject('Authentication.jwt.secret')
  public readonly jwtSecret: string;
  @inject('Authentication.jwt.expiresIn')
  public readonly jwtExpiresIn: string;
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token : UserProfile is null',
      );
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error generating token ' + err);
    }
    return token;
  }
}
