import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SessionMiddleware } from './auth/session.middleware';
import  passport from 'passport';
import { configurePassport } from './auth/passport.config';
import { AuthService } from './auth/auth.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const authService = app.get(AuthService);
 configurePassport(authService);
  app.use(SessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(parseInt(process.env.PORT || '5001', 10));
  console.log(`🚀 GraphQL API running at http://localhost:5001/graphql`);
}
bootstrap();
 