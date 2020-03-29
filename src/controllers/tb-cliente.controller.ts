import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { inject } from '@loopback/core';

import { TbCliente, TbReceta } from '../models';
import { TbClienteRepository, Credentials, TbRecetaRepository } from '../repositories';
import { UserProfile } from '@loopback/security';

//#region Mis imports

import Validar = require('../Procesos/validar');
import debug from 'debug';

import { BcyptHasher } from '../Procesos/hash.password.bcrypt';
import { MyClientService } from '../Procesos/client-service';
import { CredentialsRequestBody } from './specs/client.controller.spec';
import { JwtService } from '../Procesos/jwt-service';
import {
  TokenServiceBindings,
  UserServiceBindings,
  PasswordHasherBindings,

  ArrayPermissionKeys,
} from '../keys';
import { UserService, TokenService, authenticate, AuthenticationBindings, UserProfileFactory } from '@loopback/authentication';

import { ok, err, Result } from 'neverthrow'
import { resultado } from './../Procesos/Resultado'

//#endregion

export class TbClienteController {
  constructor(
    @repository(TbRecetaRepository)
    public tbRecetaRepository: TbRecetaRepository,
    @repository(TbClienteRepository)
    public tbClienteRepository: TbClienteRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcyptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,//public jwtService: JwtService,
    public arrayPermissions: ArrayPermissionKeys = new ArrayPermissionKeys(),
  ) { }

  @post('/Cliente', {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbCliente) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, {
            title: 'NewTbCliente',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbCliente: Omit<TbCliente, '_id'>,
  ): Promise<Result<TbCliente, Error>> {
    const verificar = await Validar.isFine(tbCliente);
    if (!verificar.valido) return err(new HttpErrors.UnprocessableEntity(verificar.incidente))



    if ((await this.findbyCorreo(tbCliente.sCorreo)).length > 0) return err(new HttpErrors.UnprocessableEntity('Ese correo ya existe'))


    //esLint-disable-next-line require-atomic-updates
    tbCliente.sContrasena = await this.hasher.hashPassword(
      tbCliente.sContrasena,
    );

    tbCliente.aPermisos = [this.arrayPermissions.AccessAuthFeature];
    const saved = await this.tbClienteRepository.create(tbCliente);
    delete saved.sContrasena;

    return ok(saved);
  }

  @get('/Cliente/count', {
    responses: {
      '200': {
        description: 'TbCliente model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbCliente))
    where?: Where<TbCliente>,
  ): Promise<Count> {
    return this.tbClienteRepository.count(where);
  }

  @get('/Cliente', {
    responses: {
      '200': {
        description: 'Array of TbCliente model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCliente, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCliente))
    filter?: Filter<TbCliente>,
  ): Promise<TbCliente[]> {
    return this.tbClienteRepository.find(filter);
  }

  @patch('/Cliente', {
    responses: {
      '200': {
        description: 'TbCliente PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, { partial: true }),
        },
      },
    })
    tbCliente: TbCliente,
    @param.query.object('where', getWhereSchemaFor(TbCliente))
    where?: Where<TbCliente>,
  ): Promise<Count> {
    return this.tbClienteRepository.updateAll(tbCliente, where);
  }

  @get('/Cliente/{id}', {
    responses: {
      '200': {
        description: 'TbCliente model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCliente, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCliente))
    filter?: Filter<TbCliente>,
  ): Promise<TbCliente> {
    return this.tbClienteRepository.findById(id, filter);
  }

  @patch('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCliente, { partial: true }),
        },
      },
    })
    tbCliente: TbCliente,
  ): Promise<void> {
    await this.tbClienteRepository.updateById(id, tbCliente);
  }

  @put('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbCliente: TbCliente,
  ): Promise<void> {
    await this.tbClienteRepository.replaceById(id, tbCliente);
  }

  @del('/Cliente/{id}', {
    responses: {
      '204': {
        description: 'TbCliente DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbClienteRepository.deleteById(id);
  }

  async findbyCorreo(correo: string): Promise<TbCliente[]> {
    return await this.tbClienteRepository.find({
      where: {
        sCorreo: '' + correo,
      },
    });
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
                TbCliente: getModelSchemaRef(TbCliente, { includeRelations: true }),
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<Result<{ token: string; cliente: TbCliente }, Error>> {

    try {

      console.log(credentials);
      const cliente = await this.clientService.verifyCredentials(credentials)//.catch(err=>{ return err(new Error('asd'))});
      //console.log(cliente);


      const UserProfile = this.clientService.convertToUserProfile(cliente);
      //console.log(UserProfile);


      const token = await this.jwtService.generateToken(UserProfile);
      delete cliente.sContrasena;



      return ok({ token, cliente });
    } catch (error) {
      return err(error)
    }

  }


  @get('/Cliente/token')
  @authenticate('jwt')
  async me(@inject(AuthenticationBindings.CURRENT_USER)
  currentUser: UserProfile, ): Promise<UserProfile> {
    console.log(currentUser)

    console.log(this.arrayPermissions)
    return Promise.resolve(currentUser);
  }


  @get('/Cliente/Ver/{id}')
  @authenticate('jwt')
  async verReceta(@inject(AuthenticationBindings.CURRENT_USER)
  currentUser: UserProfile,
    @param.path.string('id') id: string, ): Promise<Result<boolean, Error>> {
    //console.log(currentUser)

    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    const Receta: TbReceta = await this.tbRecetaRepository.findById(id).catch(() => { return undefined })

    if (Receta === undefined) {
      return err(new HttpErrors[400]('receta no encontrada'))
    }

    if ((Receta.iPrecio > 0) && (admit.aRecetas === undefined || admit.aRecetas.indexOf('' + Receta._id) === -1)) {

      return ok(false);

    } else {
      return ok(true);
    }



  }


  @get('/Cliente/eo')

  async me2()
    : Promise<string> {


    console.log(this.arrayPermissions)
    return Promise.resolve('ok');
  }


}
