import { BindingKey } from '@loopback/core';
import { TokenService, UserService } from '@loopback/authentication';
import { Credentials } from './repositories/tb-cliente.repository';
import { TbCliente } from './models';
import { passwordHasher } from './Procesos/hash.password.bcrypt';
import { JwtService } from './Procesos/jwt-service';


interface IDictionary {
  [index: string]: string;
}


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




export class tables {
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

  getDictionary() {
    var params = {} as IDictionary
    params['create'] = this.create
    params['count'] = this.count
    params['find'] = this.find
    params['updateAll'] = this.updateAll
    params['findById'] = this.findById
    params['updateById'] = this.updateById
    params['replaceById'] = this.replaceById
    params['deleteById'] = this.deleteById



    return params
  }

  getArray() {
    return [this.create,
    this.count,
    this.find,
    this.updateAll,
    this.findById,
    this.updateById,
    this.replaceById,
    this.deleteById,

    ]
  }

}

export class ArrayPermissionKeys {


  Cliente: tables
  Articulo: tables
  Factura: tables
  Historial: tables
  Receta: tables
  Categoria: tables
  manage = {
    Himself: 'manageHimself',// ¡PELIGRO! permite a un admin hacer updates a su propia cuenta
    Cliente: 'manageClientes',// ¡PELIGRO! permite a un admin hacer updates a los clientes
    admin: 'manageAdmin'// ¡PELIGRO! permite a un admin hacer updates a otros admins
  }

  AccessAuthFeature: string = 'AccessAuthFeature'



  constructor() {

    this.Cliente = new tables('TbCliente')
    this.Articulo = new tables('TbArticulo')
    this.Factura = new tables('TbFactura')
    this.Historial = new tables('TbHistorial')
    this.Receta = new tables('TbReceta')
    this.Categoria = new tables('TbCategoria')

  }

}
export class BrainTreeKeys {

  //environment: string = "braintree.Environment.Sandbox"
  merchantId: string = '9gfqjffkspt8777n'
  publicKey: string = '95w2v6gb6bgdrmwz'
  privateKey: string = '68b004efeeff106dc0b8703dc482558c'

}
