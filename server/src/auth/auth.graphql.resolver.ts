import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserObject } from './dto/user.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Protected route to get the current user
  @Query(() => UserObject, { name: 'me', nullable: true })
  @UseGuards(AuthGuard)
  async me(@Context() ctx: any) {
    const req = ctx.req;
    const userId = req.user.claims.sub;
    return this.authService.getUser(userId);
  }

  // Initiates Google login
  @Query(() => String)
  async login(@Context() ctx: any) {
    ctx.req.session.redirectTo = '/dashboard';
    return 'Redirecting to Google login...';
  }

  // Logs the user out
  @Query(() => String)
  async logout(@Context() ctx: any) {
    ctx.req.logout();
    return 'Logged out successfully';
  }
}
