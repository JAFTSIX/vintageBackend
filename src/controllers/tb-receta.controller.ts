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
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { TbReceta } from '../models';
import { TbRecetaRepository } from '../repositories';
import {
  TbRecetaResponses,
  TbRecetaRequest
} from '../bodies/tb-receta.responses';
const Responses: TbRecetaResponses = new TbRecetaResponses();
const Request: TbRecetaRequest = new TbRecetaRequest();


import {
  MyClientService
} from '../Services/client-service';
import {
  inject
} from '@loopback/core';
import {
  UserProfile
} from '@loopback/security';
import {
  ok,
  err,
  Result
} from 'neverthrow';
import { Authorization } from '../Services/authorization'
import {
  TokenServiceBindings,
  UserServiceBindings,

} from '../keys';
import {
  TokenService,
  authenticate,
  AuthenticationBindings,
} from '@loopback/authentication';
import { constants } from '../authorization.constants';

export class TbRecetaController {
  constructor(
    @repository(TbRecetaRepository)
    public tbRecetaRepository: TbRecetaRepository,
    @inject(UserServiceBindings.USER_SERVICE) public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService, //public jwtService: JwtService,
  ) { }
  public pass: Authorization

  @post('/Receta', Responses.create)
  @authenticate('jwt')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody(Request.create)
    tbReceta: Omit<TbReceta, '_id'>,
  ): Promise<Result<TbReceta, Error>> {

    if (await this.pass.isUnauthorized(constants.context.receta, constants.action.create, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbRecetaRepository.create(tbReceta));

  }

  @get('/Receta/count', Responses.count)
  async count(
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Result<Count, Error>> {

    return ok(await this.tbRecetaRepository.count(where));

  }

  @get('/Receta', Responses.find)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>,
  ): Promise<Result<TbReceta[], Error>> {

    return ok(await this.tbRecetaRepository.find(filter));

  }


  @patch('/Receta', Responses.updateAll)
  @authenticate('jwt')
  async updateAll(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody(Request.updateAll)
    tbReceta: TbReceta,
    @param.query.object('where', getWhereSchemaFor(TbReceta)) where?: Where<TbReceta>,
  ): Promise<Result<Count, Error>> {

    if (await this.pass.isUnauthorized(constants.context.receta, constants.action.updateAll, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbRecetaRepository.updateAll(tbReceta, where));
  }


  @get('/Receta/{id}', Responses.findById)//
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbReceta)) filter?: Filter<TbReceta>
  ): Promise<Result<TbReceta, Error>> {
    return ok(await this.tbRecetaRepository.findById(id, filter));
  }


  @patch('/Receta/{id}', Responses.updateById)
  @authenticate('jwt')
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody(Request.updateById)
    tbReceta: TbReceta,
  ): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.receta, constants.action.updateById, currentUser)) Promise.reject;

      await this.tbRecetaRepository.updateById(id, tbReceta);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }
  }


}
