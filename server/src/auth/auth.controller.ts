import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)  // protect the route
  @Get('user')
  async getUser(@Req() req: any) {
    const userId = req.user.claims.sub; // comes from your guard
    return this.authService.getUser(userId);
  }
}
