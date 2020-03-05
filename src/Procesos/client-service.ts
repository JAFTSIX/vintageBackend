import { UserService } from '@loopback/authentication';
import { UserProfile, securityId } from '@loopback/security';
import { Credentials, TbClienteRepository } from '../repositories/tb-cliente.repository';
import { TbCliente } from '../models';
import { repository } from '@loopback/repository';
import { HttpErrors } from '@loopback/rest';
import { BcyptHasher } from './hash.password.bcrypt';
import { inject } from '@loopback/core';
import { PasswordHasherBindings } from '../keys';

export class MyClientService implements UserService<TbCliente, Credentials> {


  constructor(@repository(TbClienteRepository) public tbClienteRepository: TbClienteRepository, @inject(PasswordHasherBindings.PASSWORD_HASHER) public hasher: BcyptHasher, ) { }


  async verifyCredentials(credentials: Credentials): Promise<TbCliente> {
    const foundUser = await this
      .tbClienteRepository
      .findOne({
        where: {
          sCorreo: credentials.email
        }
      });

    if (!foundUser) {
      throw new HttpErrors.NotFound('El usuario no existe');
    }
    const passwordMatch = await this
      .hasher
      .comparePassword(credentials.password, foundUser.sContrasena);
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('Contraseña incorrecta');
    }
    return foundUser;
  }


  convertToUserProfile(usuario: TbCliente): UserProfile {


    return {
      [securityId]: usuario._id + '',
      email: usuario.sCorreo,
      name: usuario.sNombre
    };
  }

  async UserProfileToTbCliente(usuario: UserProfile): Promise<TbCliente> {

    const foundUser = await this
      .tbClienteRepository
      .findOne({
        where: {
          sCorreo: usuario.email
        }
      });

    if (!foundUser) {
      throw new HttpErrors.NotFound('El usuario no se enontró');
    }
    return foundUser

  }

}
