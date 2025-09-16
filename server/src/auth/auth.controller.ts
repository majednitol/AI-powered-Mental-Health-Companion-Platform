// src/auth/auth.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import passport from 'passport';
import type { Request, Response } from 'express';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

@Controller('api')
export class AuthController {
  // Redirect user to Google login
  @Get('login')
  login(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('openidconnect', {
      scope: ['openid', 'email', 'profile'],
    })(req, res);
  }

  // Google OAuth callback
  @Get('callback')
  callback(@Req() req: Request, @Res() res: Response) {
    passport.authenticate('openidconnect', (err, user) => {
      if (err) {
        console.error('Callback error:', err);
        return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
      }

      if (!user) {
        console.warn('No user returned from Google OIDC');
        return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
      }

      // Log in the user
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error('Login error:', loginErr);
          return res.redirect(`${FRONTEND_URL}/login?error=login_failed`);
        }

        // Optional: inspect session
        console.log('User logged in, session:', req.session);

        // Successful login → redirect once
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      });
    })(req, res);
  }

  // Logout
  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect(FRONTEND_URL);
    });
  }
}
