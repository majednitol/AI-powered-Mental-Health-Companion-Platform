// src/auth/auth.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.graphql.resolver';
import { GoogleStrategy } from './google.strategy';
import { SessionMiddleware } from './session.middleware';
import { OidcService } from './oidc.service'; 

@Module({
  controllers: [AuthController],
  providers: [AuthGuard, AuthService, AuthResolver, GoogleStrategy, OidcService], 
  exports: [AuthGuard, AuthService, OidcService], 
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*'); 
  }
}
