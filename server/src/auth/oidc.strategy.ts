// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy as PassportStrategyBase } from 'passport-strategy';
// import { Issuer } from 'openid-client';
// import { AuthService } from './auth.service';
// import { OidcService } from './oidc.service';

// class OidcCustomStrategy extends PassportStrategyBase {
//   name = 'oidc';
//   constructor(private oidcService: OidcService, private authService: AuthService) {
//     super();
//   }

//   async authenticate(req: any, options?: any) {
//     const { client } = await this.oidcService.getConfig();
//     // Redirect to authorization endpoint
//     const redirectUrl = client.authorizationUrl({ scope: 'openid email profile' });
//     this.redirect(redirectUrl);
//   }

//   async callback(req: any) {
//     const { client } = await this.oidcService.getConfig();
//     const params = client.callbackParams(req);
//     const tokenSet = await client.callback(process.env.CALLBACK_URL!, params);
//     const user: any = {};
//     user.claims = tokenSet.claims();
//     user.access_token = tokenSet.access_token;
//     user.refresh_token = tokenSet.refresh_token;
//     user.expires_at = user.claims?.exp;
//     await this.authService.upsertUserFromClaims(user.claims);
//     return this.success(user);
//   }
// }

// @Injectable()
// export class OidcStrategy extends PassportStrategy(OidcCustomStrategy, 'oidc') {
//   constructor(private oidcService: OidcService, private authService: AuthService) {
//     super();
//   }
// }
