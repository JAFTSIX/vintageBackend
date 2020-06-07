import { constants } from './../authorization.constants'
import { TbCliente } from '../models';
import { MyClientService } from '../Services/client-service';
import { UserServiceBindings } from '../keys';
import { inject } from '@loopback/core';
import {
  UserProfile
} from '@loopback/security';

export class Authorization {

  constructor(public clientService: MyClientService) { }




  public async isUnauthorized(context: number, action: number, currentUser: UserProfile): Promise<boolean> {
    var cliente: TbCliente = await this.clientService.UserProfileToTbCliente(currentUser);
    if (!cliente.bAdmin ||
      cliente.aPermisos === undefined ||
      cliente.aPermisos.indexOf(constants.ArrayPermissions[context][action]) === -1) {
      return true;
    }
    return false;
  }


}
