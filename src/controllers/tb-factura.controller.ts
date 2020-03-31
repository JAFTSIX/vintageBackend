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
  TbFactura,
  TbArticulo,
  TbReceta,
  TbCliente,
  Pago
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
import { ok, err, Result } from 'neverthrow'
import { resultado } from './../Procesos/Resultado'
import { UserService, TokenService, authenticate, AuthenticationBindings, UserProfileFactory } from '@loopback/authentication';
import { MyClientService } from '../Procesos/client-service';
import { CredentialsRequestBody } from './specs/client.controller.spec';
//var braintree = require('braintree');

import { Environment, connect, PaymentMethodNonce, NonceDetails, Transaction } from 'braintree';
import {
  TokenServiceBindings,
  UserServiceBindings,
  PasswordHasherBindings,
  BrainTreeKeys,
  ArrayPermissionKeys,
} from '../keys';
import { UserProfile } from '@loopback/security';
import { resolve } from 'dns';


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
  ) { }



  private gateway: braintree.BraintreeGateway = connect({
    environment: Environment.Sandbox,
    merchantId: this.btkeys.merchantId,
    publicKey: this.btkeys.publicKey,
    privateKey: this.btkeys.privateKey
  });

  @post('/Factura', {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbFactura)
          }
        },
      },
    },
  })
  @authenticate('jwt')
  async create(@inject(AuthenticationBindings.CURRENT_USER)
  currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {

          schema: getModelSchemaRef(Pago, {
            title: 'paguito',

          }),
        },
      },
    }) pago: Pago,
    // paymentMethodNonce: PaymentMethodNonce,
  ): Promise<Result<braintree.ValidatedResponse<Transaction>, Error>> {


    const tbFactura: TbFactura = plainToClass(TbFactura, pago.Factura);
    //console.log(tbFactura)
    const resultado1 = await this.sePuedeComprar(tbFactura)
    if (!resultado1.valido) return err(new HttpErrors.UnprocessableEntity(resultado1.incidente + ', no se compra'))


    const resultado2 = await this.Registrar_compra(tbFactura)
    if (!resultado2.valido) return err(new HttpErrors.UnprocessableEntity(resultado2.incidente + ', no se compra'))
    //hacer pago aqui

    const pay = pago.paymentMethodNonce


    console.log('tbFactura.iTotal', tbFactura.iTotal)
    console.log('iTotal', tbFactura.iTotal.toString())
    console.log('lenght', tbFactura.iTotal.toString().length)
    const newTransaction = await this.gateway.transaction.sale({
      amount: tbFactura.iTotal.toString(),
      paymentMethodNonce: pay,
      options: {
        submitForSettlement: true
      }
    }).then(dataY => {

      return dataY
    }).catch(() => { return undefined })

    if (newTransaction === undefined) return err(new HttpErrors[500]('problemas en braintree'))

    console.log('EN TEORIA')
    return ok(newTransaction)
  }


  @get('/Factura/compra/BT', {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {

          },
        },
      },
    },
  })
  @authenticate('jwt')
  async brain1(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Result<braintree.ValidatedResponse<braintree.ClientToken>, Error>> {

    const e: braintree.ValidatedResponse<braintree.ClientToken> = await this.gateway.clientToken.generate({}).catch(() => { return undefined })

    if (e === undefined) return err(new HttpErrors[500]('problemas en braintree'))


    return ok(e);
  }



  @get('/Factura/count', {
    responses: {
      '200': {
        description: 'TbFactura model count',
        content: {
          'application/json': {
            schema: CountSchema
          }
        },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Count> {
    return this.tbFacturaRepository.count(where);
  }

  @get('/Factura', {
    responses: {
      '200': {
        description: 'Array of TbFactura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TbFactura, {
                includeRelations: true
              }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>,
  ): Promise<TbFactura[]> {

    return this.tbFacturaRepository.find(filter);
  }

  @patch('/Factura', {
    responses: {
      '200': {
        description: 'TbFactura PATCH success count',
        content: {
          'application/json': {
            schema: CountSchema
          }
        },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbFactura, {
            partial: true
          }),
        },
      },
    }) tbFactura: TbFactura,
    @param.query.object('where', getWhereSchemaFor(TbFactura)) where?: Where<TbFactura>,
  ): Promise<Count> {
    return this.tbFacturaRepository.updateAll(tbFactura, where);
  }

  @get('/Factura/{id}', {
    responses: {
      '200': {
        description: 'TbFactura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TbFactura, {
              includeRelations: true
            }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(TbFactura)) filter?: Filter<TbFactura>
  ): Promise<TbFactura> {
    return this.tbFacturaRepository.findById(id, filter);
  }

  @patch('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TbFactura, {
            partial: true
          }),
        },
      },
    }) tbFactura: TbFactura,
  ): Promise<void> {
    await this.tbFacturaRepository.updateById(id, tbFactura);
  }

  @put('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tbFactura: TbFactura,
  ): Promise<void> {
    await this.tbFacturaRepository.replaceById(id, tbFactura);
  }

  @del('/Factura/{id}', {
    responses: {
      '204': {
        description: 'TbFactura DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tbFacturaRepository.deleteById(id);
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
  async sePuedeComprar(tbFactura: TbFactura): Promise<resultado> {

    var respuesta = new resultado(true, 'todo bien')

    const cliente = await this.tbClienteRepository.find({
      where: {
        _id: '' + tbFactura.sCliente,
      },
    });

    //si el cliente existe
    if (cliente.length > 0) for (let index = 0; index < tbFactura.aCompras.length; index++) {

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
      } else x++

      const receta = await this.tbRecetaRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (receta.length > 0) {

        if (cliente[0].aRecetas !== undefined && cliente[0].aRecetas.indexOf(elementoCarrito._id + "") !== -1) {

          respuesta = new resultado(false, 'esa receta ya está comprada');
          break;
        }


      } else x++

      if (x === 2) respuesta = new resultado(false, 'elemento no encontrado')

    }
    else { respuesta = new resultado(false, 'cliente no encontrado') }

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
  async Registrar_compra(tbFactura: TbFactura): Promise<resultado> {

    var respuesta = new resultado(true, 'todo bien')

    //si el cliente existe
    var impuesto = 0;
    var total = 0;

    tbFactura.aCompras

    for (let index = 0; index < tbFactura.aCompras.length; index++) {

      var x = 0

      const elementoCarrito: TbArticulo = plainToClass(TbArticulo, tbFactura.aCompras[index]);

      const articulo = await this.tbArticuloRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (articulo.length > 0) {
        total = total + (articulo[0].iPrecio * (elementoCarrito.iCant <= 0 ? 1 : elementoCarrito.iCant));

        console.log('(elementoCarrito.iCant <= 0 ? 1 :-----', (elementoCarrito.iCant <= 0 ? 1 : elementoCarrito.iCant))
        console.log('total', total)
        console.log('cantidad,', elementoCarrito.iCant)
        articulo[0].iCant = articulo[0].iCant - elementoCarrito.iCant;
        await this.tbArticuloRepository.updateById(articulo[0]._id, articulo[0])
      } else x++

      const receta = await this.tbRecetaRepository.find({
        where: {
          _id: '' + elementoCarrito._id,
        },
      });

      if (receta.length > 0) {
        total = total + elementoCarrito.iPrecio;

        const cliente = await this.tbClienteRepository.find({
          where: {
            _id: '' + tbFactura.sCliente,
          },
        });

        cliente[0].aRecetas?.push(elementoCarrito._id + '');
        await this.tbClienteRepository.updateById(tbFactura.sCliente, cliente[0]);
      } else x++

      if (x === 2) respuesta = new resultado(false, 'elemento no encontrado')

    };

    //sacar el iva
    tbFactura.iTotal = total


    await this.tbFacturaRepository.create(tbFactura)

    return respuesta
  }
}

