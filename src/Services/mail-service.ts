/**
 * send mail cliente
 *
 * send mail factura
 *
 */

import { getTestMessageUrl, createTransport, Transporter } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer';
import { TbFactura, TbCliente, TbArticulo } from '../models';
import {
  TokenAction, UserServiceBindings, TokenServiceBindings,

} from '../keys';
import { TbTokensRepository } from '../repositories';
import { MyClientService } from '../Services/client-service';
import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { TokenService } from '@loopback/authentication';

export class MyMailService {


  @repository(TbTokensRepository)
  public tbTokensRepository: TbTokensRepository;
  @inject(UserServiceBindings.USER_SERVICE)
  public clientService: MyClientService;
  @inject(TokenServiceBindings.TOKEN_SERVICE)
  public jwtService: TokenService;//public jwtService: JwtService,



  async activate(cliente: TbCliente) {


    const UserProfile = this.clientService.convertToUserProfile(cliente);
    const token = await this.jwtService.generateToken(UserProfile);

    //registra el token
    this.tbTokensRepository.create({
      token: token,
      sCliente: cliente._id,
      iTipo: TokenAction.ACTION.Activate,
    });

    var text = "http://localhost:3001/activar/token/" + token;
    //crear un token de activar
    //insertar como token de activar
    //enviar al correo

    await this.send({
      from: 'chefnodemail@gmail.com',
      to: cliente.sCorreo,
      subject: 'Factura',
      html: text,
    })

  }

  async Recover() {

  }

  async invoice(factura: TbFactura, cliente: TbCliente) {

    var fact: TbFactura = factura;
    delete fact._id;
    // delete fact.sCliente;

    var text = JSON.stringify(fact);

    /*factura.aCompras.forEach(element => {
      const elementoCarrito: TbArticulo = plainToClass(TbArticulo, element);
      text.concat(text, `<h3> ${elementoCarrito.sNombre}</h1>`)
    });

    text.concat(text, `<h1> total: ${factura.iTotal}$ </h1>`)*/
    console.log(text)
    await this.send({
      from: 'chefnodemail@gmail.com',
      to: cliente.sCorreo,
      subject: 'Factura',
      html: text,


    })
  }

  async send(correo: Mail.Options) {


    let transporter: Transporter = createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: 'chefnodemail@gmail.com',
        pass: 'Net0123456'
      }
    });

    transporter.sendMail(correo, function (error, info) {
      if (error) {
        console.log(error);

      } else {
        console.log('Email sent: ' + info.response);

      }
    });
  }

}
