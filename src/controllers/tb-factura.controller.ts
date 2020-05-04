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
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {
  TbFactura,
  TbArticulo,
  TbReceta,
  TbCliente,
  Payment,
} from '../models';
import {
  TbFacturaRepository,
  TbClienteRepository,
  TbArticuloRepository,
  TbRecetaRepository
} from '../repositories';
import "reflect-metadata";
import "es6-shim";
import {
  plainToClass
} from "class-transformer";
import { inject } from '@loopback/core';
import { ok, err, Result, Err } from 'neverthrow'
import { resultado } from '../Services/Result'
import { TokenService, authenticate, AuthenticationBindings } from '@loopback/authentication';
import { MyClientService } from '../Services/client-service';
import { MyMailService } from '../Services/sendMail';
import { Environment, connect, Transaction } from 'braintree';
import {
  TokenServiceBindings,
  UserServiceBindings,
  BrainTreeKeys,
} from '../keys';
import { UserProfile } from '@loopback/security';
import { resolve } from 'dns';

import {
  TbFacturaRequest,
  TbFacturaResponses
} from '../bodies/tb-factura.responses';


import {
  constants
} from './../authorization.constants'

import {
  Authorization
} from '../Services/authorization';

const Responses: TbFacturaResponses = new TbFacturaResponses();
const Request: TbFacturaRequest = new TbFacturaRequest();

export class TbFacturaController {
  constructor(
    @repository(TbFacturaRepository) public tbFacturaRepository: TbFacturaRepository,
    @repository(TbClienteRepository) public tbClienteRepository: TbClienteRepository,
    @repository(TbArticuloRepository) public tbArticuloRepository: TbArticuloRepository,
    @repository(TbRecetaRepository) public tbRecetaRepository: TbRecetaRepository,
    @inject(UserServiceBindings.USER_SERVICE)
    public clientService: MyClientService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,//public jwtService: JwtService,
    public btkeys: BrainTreeKeys = new BrainTreeKeys(),
    public pass: Authorization,
  ) { }



  private gateway: braintree.BraintreeGateway = connect({
    environment: Environment.Sandbox,
    merchantId: this.btkeys.merchantId,
    publicKey: this.btkeys.publicKey,
    privateKey: this.btkeys.privateKey
  });

  @post('/Factura', Responses.create)
  @authenticate('jwt')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody(Request.create) payment: Payment,
    // paymentMethodNonce: PaymentMethodNonce,
  ): Promise<Result<braintree.ValidatedResponse<Transaction>, Error>> {

    //recetaOProducto: 0  0=producto
    const tbCliente: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser).catch(() => { return undefined });
    if (tbCliente === undefined) return err(new HttpErrors.UnprocessableEntity('cliente  , no se compra'));

    const tbFactura: TbFactura = plainToClass(TbFactura, payment.Factura);
    //console.log(tbFactura)
    const resultado1 = await this.canBuy(tbFactura, tbCliente);
    if (!resultado1.valido) return err(new HttpErrors.UnprocessableEntity(resultado1.incidente + ', no se compra'));



    //console.log('tbFactura.iTotal', tbFactura.iTotal)
    //console.log('iTotal', tbFactura.iTotal.toString())

    const newTransaction = await this.gateway.transaction.sale({
      amount: tbFactura.iTotal.toString(),
      paymentMethodNonce: payment.paymentMethodNonce,
      options: {
        submitForSettlement: true
      }
    }).then(dataY => {
      return dataY;
    }).catch(() => { return undefined })

    if (newTransaction === undefined) return err(new HttpErrors[500]('problemas en braintree'));

    if (newTransaction.success) {
      const resultado2 = await this.buy(tbFactura, tbCliente);
      if (!resultado2.valido) return err(new HttpErrors.UnprocessableEntity(resultado2.incidente + ', no se compra'));
      await new MyMailService().factura(tbFactura, tbCliente);
    } else {
      return err(new HttpErrors[500]('problemas en la transaccion pongase en contacto con su banco o intente de nuevo'));
    }

    //console.log('compras', tbFactura.aCompras);
    //console.log('EN TEORIA');
    return ok(newTransaction);
  }


  @get('/Factura/compra/BT', Responses.BraintreeTokenGenerator)
  @authenticate('jwt')
  async BraintreeTokenGenerator(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Result<braintree.ValidatedResponse<braintree.ClientToken>, Error>> {

    const ClientToken: braintree.ValidatedResponse<braintree.ClientToken> = await this.gateway.clientToken.generate({}).catch(() => { return undefined })

    if (ClientToken === undefined) return err(new HttpErrors[500]('problemas en braintree'))


    return ok(ClientToken);
  }



  @get('/Factura/count', Responses.count)
  @authenticate('jwt')
  async count(
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Result<Count, Error>> {

    return ok(await this.tbFacturaRepository.count(where));
  }

  @get('/Factura', Responses.find)
  @authenticate('jwt')
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>,
  ): Promise<Result<TbFactura[], Error>> {

    const list = await this.tbFacturaRepository.find(filter).catch(() => { return undefined })
    if (list === undefined) return err(new HttpErrors[404]("error al buscar"));
    return ok(list);
  }

  @patch('/Factura', Responses.updateAll)
  @authenticate('jwt')
  async updateAll(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody(Request.updateAll) tbFactura: TbFactura,
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Result<Count, Error>> {
    if (await this.pass.isUnauthorized(constants.context.factura, constants.action.updateAll, currentUser))
      return err(new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación"));

    return ok(await this.tbFacturaRepository.updateAll(tbFactura, where));
  }

  @get('/Factura/{id}', Responses.findById)
  @authenticate('jwt')
  async findById(

    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>
  ): Promise<Result<TbFactura, Error>> {

    return ok(await this.tbFacturaRepository.findById(id, filter));
  }

  @patch('/Factura/{id}', Responses.updateById)
  @authenticate('jwt')
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody(Request.updateById) tbFactura: TbFactura,
  ): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.factura, constants.action.updateById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");
      await this.tbFacturaRepository.updateById(id, tbFactura);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }

  }

  @put('/Factura/{id}', Responses.replaceById)
  @authenticate('jwt')
  async replaceById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string,
    @requestBody() tbFactura: TbFactura,
  ): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.factura, constants.action.replaceById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");
      await this.tbFacturaRepository.replaceById(id, tbFactura);
      Promise.resolve;
    } catch (error) {
      Promise.reject;
    }

  }

  @del('/Factura/{id}', Responses.deleteById)
  @authenticate('jwt')
  async deleteById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.string('id') id: string): Promise<void> {
    try {
      if (await this.pass.isUnauthorized(constants.context.factura, constants.action.deleteById, currentUser))
        throw new HttpErrors.Unauthorized("permisos insuficientes para realizar esta operación");

      await this.tbFacturaRepository.deleteById(id);
      Promise.resolve
    } catch (error) {
      Promise.reject;
    }

  }






  /**
   *
   * Este metodo intenta verificar si se puede hacer la compra
   * Estos los pasos que medio sigue
   *
   * ver si es articulo o receta
   * sacar _id
   * buscar primero en articulos
   * si encuentra que es un articulo
   * actualiza la cantidad de estock    pero---el stock debe tener mas de la cantidad que pide
   * !stock-cant>=0 error
   *
   * obj buscar que el cliente no haya comprado ese curso
   * traigo el cliente -si existe
   * me fijo que id de recetas es legítimo
   * reviso su array de recetas
   * si en ese array esta elementoCarrito._id entonces tira error
   *
   *
   * extra averiguar si el elemnto tenia un id real
   * va a pasar por 2 tablas y tine que coincidir
   * @param tbFactura
   * @var recetas_del_cliente   if==0 entonces
   * @returns boolean
   */
  async canBuy(tbFactura: TbFactura, tbCliente: TbCliente): Promise<resultado> {

    var respuesta = new resultado(true, 'todo bien')

    const aCompras = [];

    var total = 0;


    for (let index = 0; index < tbFactura.aCompras.length; index++) {

      var x = 0
      const elementoCarrito: TbArticulo = plainToClass(TbArticulo, tbFactura.aCompras[index]);

      const articulo = await this.tbArticuloRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (articulo.length > 0) {

        if (!((articulo[0].iCant - elementoCarrito.iCant) >= 0)) {
          respuesta = new resultado(false, 'insuficiente stock');
          break;
        }
        if (!(elementoCarrito.iCant > 0)) {
          respuesta = new resultado(false, 'cantidad de articulo inválida');
          break;

        }
        total = total + (articulo[0].iPrecio * (elementoCarrito.iCant <= 0 ? 1 : elementoCarrito.iCant));
        articulo[0].iCant = elementoCarrito.iCant
        aCompras.push(articulo[0]);

      } else x++

      const receta = await this.tbRecetaRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (receta.length > 0) {

        if (tbCliente.aRecetas !== undefined && tbCliente.aRecetas.indexOf(receta[0]._id + "") !== -1) {

          respuesta = new resultado(false, 'esa receta ya está comprada');
          break;
        }
        total = total + elementoCarrito.iPrecio;
        aCompras.push(receta[0]);
      } else x++

      if (x === 2) respuesta = new resultado(false, 'elemento no encontrado');

    }

    tbFactura.aCompras = aCompras;

    tbFactura.iTotal = total;
    return respuesta
  }



  /**
   * primero debo
   *intento calcular el total y el subtotal
   *restar la cantidad del stock
   * agregar las recetas al cliente
   * @param tbFactura
   * @returns resultado
   *
   */
  async buy(tbFactura: TbFactura, tbCliente: TbCliente): Promise<resultado> {

    var respuesta = new resultado(true, 'todo bien')


    for (let index = 0; index < tbFactura.aCompras.length; index++) {



      const elementoCarrito: TbArticulo = plainToClass(TbArticulo, tbFactura.aCompras[index]);

      const articulo = await this.tbArticuloRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (articulo.length > 0) {

        articulo[0].iCant = articulo[0].iCant - elementoCarrito.iCant;
        await this.tbArticuloRepository.updateById(articulo[0]._id, articulo[0])
      } else {


        tbCliente.aRecetas?.push(elementoCarrito._id + '');
        await this.tbClienteRepository.updateById(tbFactura.sCliente, tbCliente);
      }

    };

    await this.tbFacturaRepository.create(tbFactura)

    return respuesta
  }



}

