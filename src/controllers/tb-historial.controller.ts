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
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import { TbHistorial } from '../models';
import { TbHistorialRepository } from '../repositories';
import {
  TbHistorialResponses,
  TbHistorialRequest
} from '../bodies/tb-historial.responses';
const Responses: TbHistorialResponses = new TbHistorialResponses();
const Request: TbHistorialRequest = new TbHistorialRequest();

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
  AuthenticationBindings
} from '@loopback/authentication';
import { constants } from '../authorization.constants';


export class TbHistorialController {
  constructor(
    @repository(TbHistorialRepository)
    public tbHistorialRepository: TbHistorialRepository,
    @inject(UserServiceBindings.USER_SERVICE) public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService, //public jwtService: JwtService,
    public pass: Authorization,
  ) { }

  @post('/Historial', Responses.create)
  async create(
    @requestBody(Request.create)
    tbHistorial: Omit<TbHistorial, '_id'>,
  ): Promise<Result<TbHistorial, Error>> {

    var result = await this.tbHistorialRepository.create(tbHistorial).catch(undefined);
    if (result === undefined) return err(new HttpErrors[503]("problemas al insertar"));

    return ok(result);
  }

  @get('/Historial/count', Responses.count)
  async count(
    @param.query.object('where', getWhereSchemaFor(TbHistorial)) where?: Where<TbHistorial>,
  ): Promise<Result<Count, Error>> {
    return ok(await this.tbHistorialRepository.count(where));
  }

  @get('/Historial', Responses.find)
  @authenticate('jwt')
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(TbHistorial)) filter?: Filter<TbHistorial>,
  ): Promise<Result<TbHistorial[], Error>> {

    if (await this.pass.isUnauthorized(constants.context.historial, constants.action.find, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbHistorialRepository.find(filter));

  }

}
