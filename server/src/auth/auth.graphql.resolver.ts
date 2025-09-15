import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserObject } from './dto/user.types';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => UserObject, { name: 'me', nullable: true })
  @UseGuards(AuthGuard)
  async me(@Context() ctx: any) {
    const req = ctx.req;
    const userId = req.user.claims.sub;
    return this.authService.getUser(userId);
  }
}
