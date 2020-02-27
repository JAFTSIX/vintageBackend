import {UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '../keys';
import {TokenService} from '@loopback/authentication';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);

export class JwtService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
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
