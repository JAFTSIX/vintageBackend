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

import { TbCliente } from '../models';
import { TbClienteRepository, Credentials } from '../repositories';
import { securityId } from '@loopback/security';

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
} from '../keys';
import { UserService, TokenService, authenticate } from '@loopback/authentication';

//#endregion

export class TbClienteController {
  constructor(
    @repository(TbClienteRepository)
    public tbClienteRepository: TbClienteRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcyptHasher,
    @inject(UserServiceBindings.USER_SERVICE)
    public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,//public jwtService: JwtService,

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
  ): Promise<TbCliente> {
    const verificar = await Validar.isFine(tbCliente);
    if (!verificar.valido)
      throw new HttpErrors.UnprocessableEntity(verificar.incidente);

    if ((await this.findbyCorreo(tbCliente.sCorreo)).length > 0)
      throw new HttpErrors.UnprocessableEntity('Ese correo ya existe');

    //esLint-disable-next-line require-atomic-updates
    tbCliente.sContrasena = await this.hasher.hashPassword(
      tbCliente.sContrasena,
    );

    tbCliente.bActivo = true;
    const saved = await this.tbClienteRepository.create(tbCliente);
    delete saved.sContrasena;
    return saved;
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
                idCliente: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string; idCliente: string }> {
    const cliente = await this.clientService.verifyCredentials(credentials);
    //console.log(cliente);

    //esta madre no tiene promises ni await
    const UserProfile = this.clientService.convertToUserProfile(cliente);
    console.log(UserProfile);


    const token = await this.jwtService.generateToken(UserProfile);
    const idCliente = await UserProfile[securityId];
    return Promise.resolve({ token, idCliente });
  }

  @get('/Cliente/picha')
  @authenticate('jwt')
  async me(): Promise<string> {
    return Promise.resolve('YEEEEES')
  }

}
