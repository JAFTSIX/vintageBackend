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
    console.log(currentUser)

    const pretender: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser)
    if (!pretender.bAdmin) {
      throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

    }
    const categoria = await this.tbCategoriaRepository.create(tbCategoria);
    delete categoria._id
    return categoria
  }



  @get('/Categoria/count', {
    responses: {
      '200': {
        description: 'TbCategoria model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Count> {
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
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>,
  ): Promise<TbCategoria[]> {
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
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbCategoria, { partial: true }),
        },
      },
    })
    tbCategoria: TbCategoria,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Count> {
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
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>
  ): Promise<TbCategoria> {
    return this.tbCategoriaRepository.findById(id, filter);
  }


  @patch('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PATCH success',
      },
    },
  })
  async updateById(
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
    await this.tbCategoriaRepository.updateById(id, tbCategoria);
  }


  @put('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbCategoria: TbCategoria,
  ): Promise<void> {
    await this.tbCategoriaRepository.replaceById(id, tbCategoria);
  }


  @del('/Categoria/{id}', {
    responses: {
      '204': {
        description: 'TbCategoria DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbCategoriaRepository.deleteById(id);
  }

}
