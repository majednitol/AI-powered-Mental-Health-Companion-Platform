import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.graphql.resolver';

@Module({
  providers: [AuthGuard, AuthService, AuthResolver],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
