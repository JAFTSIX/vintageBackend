import { UserProfile, securityId, SecurityBindings } from '@loopback/security';
import { promisify } from 'util';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { TokenServiceBindings } from '../keys';
import { TokenService } from '@loopback/authentication';
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);
//const Logout = promisify(jwt.Logout);
import { TbTokens } from '../models';
import { TbTokensRepository } from '../repositories';
import { repository } from '@loopback/repository';
import { TokenAction, } from '../keys';


export class JwtService implements TokenService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly jwtExpiresIn: string;
  @repository(TbTokensRepository)
  public tbTokensRepository: TbTokensRepository;

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: 'token' is null`,
      );
    }
    const tbtoken = await this.findToken(token);
    let userProfile: UserProfile;

    try {

      //revisar que el token esta en la base de datos

      if (tbtoken.length <= 0) throw 'Error verifying token: unkown';


      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { [securityId]: '', name: '', email: '' },
        { [securityId]: decryptedToken[securityId], name: decryptedToken.name, email: decryptedToken.email },
      );
    } catch (error) {

      if (tbtoken[0].iTipo == TokenAction.ACTION.login && error.message === 'jwt expired') {
        //anular token
        //borrar de la base de datos
        this.destroyToken(tbtoken[0]);
      }
      if (tbtoken[0].iTipo == TokenAction.ACTION.Activate && error.message === 'jwt expired') {
        //anular token
        //borrar de la base de datos

        //borrarusuario con ese token
        this.destroyToken(tbtoken[0]);
      }
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {

    let token = '';
    try {

      if (!userProfile) {
        throw new HttpErrors.Unauthorized(
          'Error while generating token : UserProfile is null',
        );
      }

      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized('Error generating token ' + err);
    }
    return token;
  }

  async findToken(token: string): Promise<TbTokens[]> {

    return await this.tbTokensRepository.find({
      where: {
        token: '' + token,
      },
    });
  }

  async destroyToken(token: TbTokens): Promise<void> {

    //eliminarlo
    await this.tbTokensRepository.deleteById(token._id);
  }


}
