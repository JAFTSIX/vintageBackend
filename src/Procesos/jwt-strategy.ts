import {
    AuthenticationStrategy,
} from '@loopback/authentication'
import { Request, HttpErrors } from '@loopback/rest'
import { UserProfile } from "@loopback/security"
import { inject } from '@loopback/core';
import { TokenServiceBindings } from '../keys';
import { JwtService } from './jwt-service';

export class JWTStrategy implements AuthenticationStrategy {

    constructor(@inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JwtService,
    ) { }
    name: string = 'jwt';

    async authenticate(request: Request):
        Promise<UserProfile | undefined> {
        const token: string = this.extractCredentials(request)
        const UserProfile = await this.jwtService.verifyToken(token)
        return Promise.resolve(UserProfile)
    }

    extractCredentials(request: Request): string {
        if (!request.headers.authorization) {
            throw new HttpErrors.Unauthorized('saque token papa');
        }

        const authHeaderValue = request.headers.authorization

        if (!authHeaderValue.startsWith('Bearer')) throw new HttpErrors.Unauthorized('header is not Bearer');


        const regexauth = /^Bearer\s+(.+\.){2}(.+){2}?/
        if (!regexauth.test(authHeaderValue)) throw new HttpErrors.Unauthorized('the header is wrong gfo');


        return authHeaderValue.split(' ')[1]
    }

}
