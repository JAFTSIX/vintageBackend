import {UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {HttpErrors} from '@loopback/rest';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);

export class JwtService {
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating token : UserProfile is null',
      );
    }
    let token = '';
    try {
      token = await signAsync(userProfile, 'contra', {expiresIn: '6h'});
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error generating token ' + err);
    }
    return token;
  }
}
