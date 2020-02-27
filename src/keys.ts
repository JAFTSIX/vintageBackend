import {BindingKey} from '@loopback/core';
import {TokenService, UserService} from '@loopback/authentication';
import {Credentials} from './repositories/tb-cliente.repository';
import {TbCliente} from './models';
import {passwordHasher} from './Procesos/hash.password.bcrypt';
import {JwtService} from './Procesos/jwt-service';

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
  export const TOKEN_SERVICE = BindingKey.create<JwtService>(
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
