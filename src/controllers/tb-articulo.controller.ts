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
import {
  TbArticulo
} from '../models';
import {
  TbArticuloRepository
} from '../repositories';
import {
  TbArticuloResponses,
  TbArticuloRequest
} from '../bodies/tb-articulo.responses';


import {
  authenticate,
  AuthenticationBindings,
  TokenService
} from '@loopback/authentication';
import {
  inject
} from '@loopback/core';
import {
  TokenServiceBindings
} from '../keys';
import {
  UserProfile
} from '@loopback/security';
import {
  constants
} from './../authorization.constants'
import {
  ok,
  err,
  Result
} from 'neverthrow';
import {
  Authorization
} from '../Services/authorization';

const Responses: TbArticuloResponses = new TbArticuloResponses();
const Request: TbArticuloRequest = new TbArticuloRequest();



export class TbArticuloController {
  constructor(
    @repository(TbArticuloRepository)
    public tbArticuloRepository: TbArticuloRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,

  ) { }
  public pass: Authorization
  @post('/Articulo', Responses.create)
  @authenticate('jwt')
  async create(
    @requestBody(Request.create) tbArticulo: Omit<TbArticulo, '_id'>,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<Result<TbArticulo, Error>> {
    if (await this.pass.isUnauthorized(constants.context.articulo, constants.action.create, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbArticuloRepository.create(tbArticulo));
  }

  @get('/Articulo/count', Responses.count)
  @authenticate('jwt')
  async count(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(TbArticulo)) where?: Where<TbArticulo>,

  ): Promise<Result<Count, Error>> {

    if (await this.pass.isUnauthorized(constants.context.articulo, constants.action.count, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));


    return ok(await this.tbArticuloRepository.count(where));
  }

  @get('/Articulo', {
    responses: {
      '200': {
        description: 'Array of TbArticulo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbArticulo, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbArticulo)) filter?: Filter<TbArticulo>,
  ): Promise<TbArticulo[]> {
    return await this.tbArticuloRepository.find(filter);
  }

  @patch('/Articulo', Responses.updateAll)
  @authenticate('jwt')
  async updateAll(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody(Request.updateAll) tbArticulo: TbArticulo,
    @param.query.object('where', getWhereSchemaFor(TbArticulo)) where?: Where<TbArticulo>,
  ): Promise<Result<Count, Error>> {
    if (await this.pass.isUnauthorized(constants.context.articulo, constants.action.updateAll, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));
    return ok(await this.tbArticuloRepository.updateAll(tbArticulo, where));
  }

  @get('/Articulo/{id}', Responses.findById)
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbArticulo)) filter?: Filter<TbArticulo>
  ): Promise<Result<TbArticulo, Error>> {
    return ok(await this.tbArticuloRepository.findById(id, filter));
  }

  @patch('/Articulo/{id}', Responses.updateById)
  @authenticate('jwt')
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody(Request.updateById) tbArticulo: TbArticulo,
  ): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.articulo, constants.action.updateById, currentUser))
        new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");
      await this.tbArticuloRepository.updateById(id, tbArticulo);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }

  }

  @put('/Articulo/{id}', Responses.replaceById)
  @authenticate('jwt')
  async replaceById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() tbArticulo: TbArticulo,
  ): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.articulo, constants.action.replaceById, currentUser))
        new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");
      await this.tbArticuloRepository.replaceById(id, tbArticulo);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }
  }



}
