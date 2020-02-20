import {UserService} from '@loopback/authentication';
import {Credentials} from '../repositories/tb-cliente.repository';
import {TbCliente} from '../models';

export class MyClientService implements UserService<TbCliente, Credentials> {
  verifyCredentials(credentials: Credentials): Promise<TbCliente> {
    throw new Error('Method not implemented.');
  }
  convertToUserProfile(
    user: TbCliente,
  ): import('@loopback/security').UserProfile {
    throw new Error('Method not implemented.');
  }
}

/*verifyCredentials(credentials: Credentials): Promise<TbCliente> {
  throw new Error('Method not implemented.');
}
convertToUserProfile(
  client: TbCliente,
): import('@loopback/authentication').UserProfile {
  throw new Error('Method not implemented.');
}*/
//Como dato curioso, lo comentado arriba no funciona, pero si lo autogenero todo va de puta madre........... xD
