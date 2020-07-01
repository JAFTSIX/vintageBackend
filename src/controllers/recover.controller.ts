import {
  Count,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  requestBody,
  HttpErrors,
  getModelSchemaRef,
} from '@loopback/rest';
import { inject } from '@loopback/core';

import { TbCliente, TbReceta, Password } from '../models';
import { TbClienteRepository, TbTokensRepository } from '../repositories';
import { UserProfile } from '@loopback/security';


import format = require('../Services/Format');

import { BcyptHasher } from '../Services/hash.password.bcrypt';
import { MyClientService } from '../Services/client-service';
import { MyMailService } from '../Services/mail-service';

import { CredentialsRequestBody } from './specs/client.controller.spec';
import {
  TokenServiceBindings,
  UserServiceBindings,
  PasswordHasherBindings,
  TokenAction,

} from '../keys';
import { TokenService, authenticate, AuthenticationBindings } from '@loopback/authentication';

import { ok, err, Result } from 'neverthrow'
import { constants } from './../authorization.constants'

//tengo que crear un controller
//y poner los 2

export class RecoverController {
  constructor(

    @repository(TbClienteRepository)
    public tbClienteRepository: TbClienteRepository,

    @repository(TbTokensRepository)
    public tbTokensRepository: TbTokensRepository,


    @inject(UserServiceBindings.USER_SERVICE)
    public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,//public jwtService: JwtService,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcyptHasher,


  ) { }

  @get('/Recuperar/solicitar/correo/{id}', {
    responses: {
      '204': {
        description: 'revisa tu correo',
      },
    },
  }
  )
  async request(
    @param.path.string('id') correo: string
  ): Promise<Result<{}, Error>> {


    var client = await this.tbClienteRepository.find({
      where: {
        sCorreo: '' + correo,
      },
    });
    if (client.length == 1) {


      const UserProfile = this.clientService.convertToUserProfile(client[0]);
      const token = await this.jwtService.generateToken(UserProfile);

      //registra el token
      this.tbTokensRepository.create({
        token: token,
        sCliente: client[0]._id,
        iTipo: TokenAction.ACTION.recover,
      });
      await new MyMailService().Recover(client[0], token);
    } else {
      return err(new Error('entidad no encontrada'));
    }


    return ok({});
  }


  @patch('/Recuperar/token/{id}', {
    responses: {
      '204': {
        description: 'revisa tu correo',
      },
    },
  }
  )
  async changePassword(
    @param.path.string('id') token: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Password, {
            title: 'NewPassword',
          }),
        },
      },
    }
    )
    password: Password,
  ): Promise<Result<string, Error>> {



    try {

      const userProfile = await this.jwtService.verifyToken(token).catch(() => { return undefined })
      if (userProfile === undefined) return ok("token incorrecto o expirado solicite renovación de contraseña nuevamente");
      const client = await this.clientService.UserProfileToTbCliente(userProfile);


      var tbToken = await this.tbTokensRepository.find({
        where: {
          token: '' + token,
        },
      });
      if (tbToken[0].iTipo != TokenAction.ACTION.recover) return ok("tipo de token incorrecto");

      //esLint-disable-next-line require-atomic-updates
      client.sContrasena = await this.hasher.hashPassword(password + '');


      await this.tbClienteRepository.updateById(client._id, client);

      await this.tbTokensRepository.deleteById(tbToken[0]._id);
    } catch (error) {
      return err(error);
    }



    return ok("todo bien");
  }

}
