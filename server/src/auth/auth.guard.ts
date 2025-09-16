import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get GraphQL context
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req;

    if (!req) {
      throw new UnauthorizedException('No request object found');
    }
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Unauthorized: No user logged in');
    }

    return true;
  }
}
