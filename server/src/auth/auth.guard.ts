import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { refreshTokensIfNeeded } from './replit-auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    const req = ctx.req || context.switchToHttp().getRequest();

    const user = req.user as any;
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      throw new UnauthorizedException('Unauthorized');
    }

    const ok = await refreshTokensIfNeeded(user);
    if (!ok) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
