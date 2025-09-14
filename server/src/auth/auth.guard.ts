import { Injectable, CanActivate, ExecutionContext, UnauthorizedException }
    from '@nestjs/common';
import { refreshTokensIfNeeded } from './replit-auth';
@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log("req.user",req.user)
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