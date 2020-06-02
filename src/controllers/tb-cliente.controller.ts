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
} from '@loopback/rest';
import { inject } from '@loopback/core';

import { TbCliente, TbReceta } from '../models';
import { TbClienteRepository, Credentials, TbRecetaRepository, TbTokensRepository, TbHistorialRepository } from '../repositories';
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
import {
  TbClienteRequest,
  TbClienteResponses
} from '../bodies/tb-cliente.responses';

const Responses: TbClienteResponses = new TbClienteResponses();
const Request: TbClienteRequest = new TbClienteRequest();
import { ok, err, Result } from 'neverthrow'
import { constants } from './../authorization.constants'



export class TbClienteController {
  constructor(
    @repository(TbRecetaRepository)
    public tbRecetaRepository: TbRecetaRepository,
    @repository(TbClienteRepository)
    public tbClienteRepository: TbClienteRepository,

    @repository(TbTokensRepository)
    public tbTokensRepository: TbTokensRepository,

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

    const verify = await format.isFine(tbCliente);
    if (!verify.valid) return err(new HttpErrors.UnprocessableEntity(verify.incident))
    if ((await this.findbyCorreo(tbCliente.sCorreo)).length > 0) return err(new HttpErrors.UnprocessableEntity('Ese correo ya existe'))
    //esLint-disable-next-line require-atomic-updates
    tbCliente.sContrasena = await this.hasher.hashPassword(
      tbCliente.sContrasena,
    );
    tbCliente.aPermisos = [constants.ArrayPermissions[constants.context.AccessAuthFeature][constants.action.AccessAuthFeature]];
    tbCliente.bActivo = false;
    const saved = await this.tbClienteRepository.create(tbCliente);
    saved.sContrasena = '';


    const UserProfile = this.clientService.convertToUserProfile(tbCliente);
    const token = await this.jwtService.generateToken(UserProfile);


    //registra el token
    this.tbTokensRepository.create({
      token: token,
      sCliente: saved._id,
      iTipo: TokenAction.ACTION.Activate,
    });

    await new MyMailService().activate(tbCliente, token);
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
      if (!cliente.bActivo) return err(new HttpErrors.Unauthorized('activa tu cuenta en el mensaje que te llega a tu correo'));


      const UserProfile = this.clientService.convertToUserProfile(cliente);
      const token = await this.jwtService.generateToken(UserProfile);

      //registra el token
      this.tbTokensRepository.create({
        token: token,
        sCliente: cliente._id,
        iTipo: TokenAction.ACTION.Login,
      });

      cliente.sContrasena = "";



      return ok({ token, cliente });
    } catch (error) {
      return err(error)
    }

  }


  @get('/Cliente/activar/token/{id}')
  async activateAccount(
    @param.path.string('id') token: string,
  ): Promise<Result<string, Error>> {

    try {

      const userProfile = await this.jwtService.verifyToken(token)
      const client = await this.clientService.UserProfileToTbCliente(userProfile);
      client.bActivo = true
      await this.tbClienteRepository.updateById(client._id, client);

      var tbToken = await this.tbTokensRepository.find({
        where: {
          token: '' + token,
        },
      });
      await this.tbTokensRepository.deleteById(tbToken[0]._id);
    } catch (error) {
      return err(error)
    }


    return ok("Su cuenta fue Activada Exitosamente");
  }



  @get('/logout')
  async logout(
    @param.header.string('Authorization') token: any
  ): Promise<void> {
    token = token.split(' ')[1]
    try {
      var tbToken = await this.tbTokensRepository.find({
        where: {
          token: '' + token,
        },
      });
      await this.tbTokensRepository.deleteById(tbToken[0]._id);
    } catch (error) {
      Promise.reject;
    }


    Promise.resolve;
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
