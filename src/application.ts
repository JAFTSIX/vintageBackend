import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {BcyptHasher} from './Procesos/hash.password.bcrypt';
import {MyClientService} from './Procesos/client-service';
import {JwtService} from './Procesos/jwt-service';
import {
  TokenServiceConstant,
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from './keys';

export class VintageBackendApp extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setupBinding();
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBinding(): void {
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcyptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyClientService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JwtService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstant.TOKEN_SECRET_VALUE,
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstant.TOKEN_EXPIRES_IN_VALUE,
    );
  }
}
