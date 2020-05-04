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
  RestBindings,
} from '@loopback/rest';
import { inject } from '@loopback/core';

import { TbCliente, TbReceta } from '../models';
import { TbClienteRepository, Credentials, TbRecetaRepository } from '../repositories';
import { UserProfile } from '@loopback/security';

//#region Mis imports

import format = require('../Services/Format');
import debug from 'debug';

import { BcyptHasher } from '../Services/hash.password.bcrypt';
import { MyClientService } from '../Services/client-service';
import { MyMailService } from '../Services/sendMail';

import { CredentialsRequestBody } from './specs/client.controller.spec';
import { JwtService } from '../Services/jwt-service';
import {
  TokenServiceBindings,
  UserServiceBindings,
  PasswordHasherBindings,


} from '../keys';
import { UserService, TokenService, authenticate, AuthenticationBindings, UserProfileFactory } from '@loopback/authentication';
import {
  TbClienteRequest,
  TbClienteResponses
} from '../bodies/tb-cliente.responses';

const Responses: TbClienteResponses = new TbClienteResponses();
const Request: TbClienteRequest = new TbClienteRequest();
import { ok, err, Result, Err } from 'neverthrow'
import { resultado } from '../Services/Result'

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


  ) { }

  @post('/Cliente', Responses.create)
  async create(
    @requestBody(Request.create)
    tbCliente: Omit<TbCliente, '_id'>,
  ): Promise<Result<TbCliente, Error>> {
    const verificar = await format.isFine(tbCliente);
    if (!verificar.valido) return err(new HttpErrors.UnprocessableEntity(verificar.incidente))
    if ((await this.findbyCorreo(tbCliente.sCorreo)).length > 0) return err(new HttpErrors.UnprocessableEntity('Ese correo ya existe'))
    //esLint-disable-next-line require-atomic-updates
    tbCliente.sContrasena = await this.hasher.hashPassword(
      tbCliente.sContrasena,
    );
    //tbCliente.aPermisos = [this.arrayPermissions.AccessAuthFeature];
    //tbCliente.bActivo = false;
    const saved = await this.tbClienteRepository.create(tbCliente);
    //delete saved.sContrasena;
    return ok(saved);
  }

  @get('/Cliente/count', Responses.count)
  async count(
    @param.query.object('where', getWhereSchemaFor(TbCliente))
    where?: Where<TbCliente>,
  ): Promise<Count> {
    return this.tbClienteRepository.count(where);
  }

  @get('/Cliente', Responses.find)
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbCliente))
    filter?: Filter<TbCliente>,
  ): Promise<TbCliente[]> {
    return this.tbClienteRepository.find(filter);
  }

  @patch('/Cliente', Responses.updateAll)
  async updateAll(
    @requestBody(Request.updateAll)
    tbCliente: TbCliente,
    @param.query.object('where', getWhereSchemaFor(TbCliente))
    where?: Where<TbCliente>,
  ): Promise<Count> {


    return this.tbClienteRepository.updateAll(tbCliente, where);
  }

  @get('/Cliente/{id}', Responses.findById)
  @authenticate('jwt')
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbCliente))
    filter?: Filter<TbCliente>,
  ): Promise<TbCliente> {
    return this.tbClienteRepository.findById(id, filter);
  }

  @patch('/Cliente/{id}', Responses.updateById)
  async updateById(
    @param.path.string('id') id: string,
    @requestBody(Request.updateById)
    tbCliente: TbCliente,
  ): Promise<Result<TbCliente, Error>> {

    var success = true

    await this.tbClienteRepository.updateById(id, tbCliente).catch(() => { success = false });


    if (success) {
      return ok(tbCliente)
    } else {
      return err(new HttpErrors.UnprocessableEntity('error al actualizar cliente'))
    }

  }

  @put('/Cliente/{id}', Responses.replaceById)
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbCliente: TbCliente,
  ): Promise<void> {
    await this.tbClienteRepository.replaceById(id, tbCliente);
  }

  @del('/Cliente/{id}', Responses.deleteById)
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

  @post('/login', Responses.login)
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<Result<{ token: string; cliente: TbCliente }, Error>> {
    try {

      console.log(credentials);
      const cliente = await this.clientService.verifyCredentials(credentials)//.catch(err=>{ return err(new Error('asd'))});


      const UserProfile = this.clientService.convertToUserProfile(cliente);


      const token = await this.jwtService.generateToken(UserProfile);
      //delete cliente.sContrasena;



      return ok({ token, cliente });
    } catch (error) {
      return err(error)
    }

  }


  @get('/Cliente/token')
  async me(
    @param.header.string('Authorization') token: any
  ): Promise<boolean> {
    //console.log(currentUser)


    //console.log(this.request)
    /*if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }*/
    const UserProfile = await this.jwtService.verifyToken(token)

    return Promise.resolve(true);
  }








  @get('/Cliente/VerS/{id}')
  @authenticate('jwt')
  async verRecetaExclusiva(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,): Promise<Result<boolean, Error>> {
    //console.log(currentUser)

    const admit: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser).catch(() => { return undefined })
    const Receta: TbReceta = await this.tbRecetaRepository.findById(id).catch(() => { return undefined })

    if (Receta === undefined) {
      return err(new HttpErrors[400]('receta no encontrada'))
    }

    if ((Receta.iPrecio > 0) && ((admit === undefined) || (admit.aRecetas === undefined || admit.aRecetas.indexOf('' + Receta._id) === -1))) {


      return ok(false);

    } else {
      return ok(true);
    }



  }


  @get('/Cliente/VerU/{id}')
  async verReceta(@param.path.string('id') id: string,): Promise<Result<boolean, Error>> {

    const Receta: TbReceta = await this.tbRecetaRepository.findById(id).catch(() => { return undefined })

    if (Receta === undefined) {
      return err(new HttpErrors[400]('receta no encontrada'))
    }

    if (Receta.iPrecio > 0) {


      return ok(false);

    } else {
      return ok(true);
    }



  }


  @get('/Cliente/cursos/{id}')
  async traerCursos(@param.path.string('id') id: string,): Promise<Result<TbReceta[], Error>> {

    var query = []
    const admit: TbCliente = await this.tbClienteRepository.findById(id).catch(() => { return undefined })
    if (admit === undefined) {
      return err(new HttpErrors[400]('cliente no encontrado'))
    }

    if (admit.aRecetas === undefined || admit.aRecetas.length < 0) {
      return ok([])
    } else {
      for (let index = 0; index < admit.aRecetas.length; index++) {


        query.push({ _id: admit.aRecetas[index] })
      }
    }

    const Receta: TbReceta[] = await this.tbRecetaRepository.find({
      where: {
        or: query
      },
    }).catch(() => { return undefined })

    if (Receta === undefined) {
      return ok([])
    } else {
      return ok(Receta)
    }



  }



}
