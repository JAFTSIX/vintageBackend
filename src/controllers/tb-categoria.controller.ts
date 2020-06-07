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
import {
  TbCategoria,
} from '../models';
import {
  TbCategoriaRepository
} from '../repositories';
import {
  TokenService,
  authenticate,
  AuthenticationBindings
} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,


} from '../keys';
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
  TbCategoriaResponses,
  TbCategoriaRequest
} from '../bodies/tb-categoria.responses';
const Responses: TbCategoriaResponses = new TbCategoriaResponses();
const Request: TbCategoriaRequest = new TbCategoriaRequest();

import { constants } from './../authorization.constants'

export class TbCategoriaController {
  constructor(
    @repository(TbCategoriaRepository) public tbCategoriaRepository: TbCategoriaRepository,
    @inject(UserServiceBindings.USER_SERVICE) public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService, //public jwtService: JwtService,


  ) { }

  public pass: Authorization = new Authorization(this.clientService);

  @post('/Categoria', Responses.create)
  @authenticate('jwt')
  async create(
    @requestBody(Request.create) tbCategoria: Omit<TbCategoria, '_id'>,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<Result<TbCategoria, Error>> {

    if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.create, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbCategoriaRepository.create(tbCategoria));
  }




  @get('/Categoria/count', Responses.count)
  @authenticate('jwt')
  async count(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,

  ): Promise<Result<Count, Error>> {


    if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.count, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbCategoriaRepository.count(where));
  }



  @get('/Categoria', Responses.find)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>,
  ): Promise<Result<TbCategoria[], Error>> {
    return ok(await this.tbCategoriaRepository.find(filter));
  }




  @patch('/Categoria', Responses.updateAll)
  @authenticate('jwt')
  async updateAll(
    @requestBody(Request.updateAll) tbCategoria: TbCategoria,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('where', getWhereSchemaFor(TbCategoria)) where?: Where<TbCategoria>,
  ): Promise<Result<Count, Error>> {


    if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.updateAll, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbCategoriaRepository.updateAll(tbCategoria, where));
  }


  @get('/Categoria/{id}', Responses.findById)
  @authenticate('jwt')
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCategoria)) filter?: Filter<TbCategoria>
  ): Promise<Result<TbCategoria, Error>> {


    if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.findById, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbCategoriaRepository.findById(id, filter));
  }


  @patch('/Categoria/{id}', Responses.updateById)
  @authenticate('jwt')
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody(Responses.updateById) tbCategoria: TbCategoria,
  ): Promise<void> {
    try {


      if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.updateById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

      await this.tbCategoriaRepository.updateById(id, tbCategoria);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }


  }


  @put('/Categoria/{id}', Responses.replaceById)
  @authenticate('jwt')
  async replaceById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() tbCategoria: TbCategoria,
  ): Promise<void> {
    try {

      if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.replaceById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");


      await this.tbCategoriaRepository.replaceById(id, tbCategoria);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }

  }


  @del('/Categoria/{id}', Responses.deleteById)
  @authenticate('jwt')
  async deleteById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.string('id') id: string
  ): Promise<void> {
    try {


      if (await this.pass.isUnauthorized(constants.context.categoria, constants.action.deleteById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");
      await this.tbCategoriaRepository.deleteById(id);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
      console.log(error);
    }

  }




}
