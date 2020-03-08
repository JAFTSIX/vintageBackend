

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
import { TbCategoria, TbCliente } from '../models';
import { TbCategoriaRepository } from '../repositories';
import { TokenService, authenticate, AuthenticationBindings } from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
  ArrayPermissionKeys,
  tables
} from '../keys';
import { MyClientService } from '../Procesos/client-service';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';






export class TbCategoriaController {
  constructor(
    @repository(TbCategoriaRepository)
    public tbCategoriaRepository: TbCategoriaRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,//public jwtService: JwtService,
    public arrayPermissions: ArrayPermissionKeys = new ArrayPermissionKeys(),

  ) { }



  @post('/Categoria', {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: { 'application/json': { schema: getModelSchemaRef(TbCategoria, { includeRelations: true }), } },

      },
    },
  })
  @authenticate('jwt')
  //@annotateName
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, {
            title: 'NewTbCategoria',
            exclude: ['_id'],
          }),
        },
      },
    })
    tbCategoria: Omit<TbCategoria, '_id'>,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<TbCategoria> {
    //console.log(currentUser)
    //const metodo = this.currentMethod
    const metodo = 'create'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }


    return await this.tbCategoriaRepository.create(tbCategoria);
  }



  @get('/Categoria/count', {
    responses: {
      '200': {
        description: 'TbCategoria model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')

  async count(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,

  ): Promise<Count> {
    const metodo = 'count'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    return this.tbCategoriaRepository.count(where);
  }



  @get('/Categoria', {
    responses: {
      '200': {
        description: 'Array of TbCategoria model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbCategoria, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate('jwt')

  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>,
  ): Promise<TbCategoria[]> {
    const metodo = 'find'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    return this.tbCategoriaRepository.find(filter);
  }




  @patch('/Categoria', {
    responses: {
      '200': {
        description: 'TbCategoria PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('jwt')

  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, { partial: true }),
        },
      },
    })
    tbCategoria: TbCategoria,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Count> {
    const metodo = 'updateAll'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    return this.tbCategoriaRepository.updateAll(tbCategoria, where);
  }


  @get('/Categoria/{id}', {
    responses: {
      '200': {
        description: 'TbCategoria model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbCategoria, { includeRelations: true }),
          },
        },
      },
    },
  })

  @authenticate('jwt')
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>
  ): Promise<TbCategoria> {
    const metodo = 'findById'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    return this.tbCategoriaRepository.findById(id, filter);
  }


  @patch('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PATCH success',
      },
    },
  })
  @authenticate('jwt')

  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, { partial: true }),
        },
      },
    })
    tbCategoria: TbCategoria,
  ): Promise<void> {
    const metodo = 'updateById'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    await this.tbCategoriaRepository.updateById(id, tbCategoria);
  }


  @put('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PUT success',
      },
    },
  })
  @authenticate('jwt')

  async replaceById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() tbCategoria: TbCategoria,
  ): Promise<void> {
    const metodo = 'replaceById'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    await this.tbCategoriaRepository.replaceById(id, tbCategoria);
  }


  @del('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria DELETE success',
      },
    },
  })
  @authenticate('jwt')

  async deleteById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string
  ): Promise<void> {
    const metodo = 'deleteById'
    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!admit.bAdmin || admit.aPermisos === undefined || admit.aPermisos.indexOf(this.arrayPermissions.Categoria.getDictionary()[metodo]) === -1) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }

    await this.tbCategoriaRepository.deleteById(id);
  }

}
