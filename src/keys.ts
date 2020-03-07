import { BindingKey } from '@loopback/core';
import { TokenService, UserService } from '@loopback/authentication';
import { Credentials } from './repositories/tb-cliente.repository';
import { TbCliente } from './models';
import { passwordHasher } from './Procesos/hash.password.bcrypt';
import { JwtService } from './Procesos/jwt-service';

export namespace TokenServiceConstant {
  export const TOKEN_SECRET_VALUE = '1234asdf';
  export const TOKEN_EXPIRES_IN_VALUE = '6h';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expiresIn',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<passwordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.rounds');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<TbCliente, Credentials>
  >('services.user.service');
}


export class ArrayPermissionKeys {


  create: string = 'create'
  count: string = 'count'
  find: string = 'find'
  updateAll: string = 'updateAll'
  findById: string = 'findById'
  updateById: string = 'updateById'
  replaceById: string = 'replaceById'
  deleteById: string = 'deleteById'

  constructor(tabla: string) {

    this.create = this.create.concat(tabla)
    this.count = this.count.concat(tabla)
    this.find = this.find.concat(tabla)
    this.updateAll = this.updateAll.concat(tabla)
    this.findById = this.findById.concat(tabla)
    this.updateById = this.updateById.concat(tabla)
    this.replaceById = this.replaceById.concat(tabla)
    this.deleteById = this.deleteById.concat(tabla)
  }

  permisos() {
    return [this.create,
    this.count,
    this.find,
    this.updateAll,
    this.findById,
    this.updateById,
    this.replaceById,
    this.deleteById]
  }


}
