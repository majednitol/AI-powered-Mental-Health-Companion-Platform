import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { setupAuth } from './auth/replit-auth';
async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    // Setup sessions and passport/OIDC (this will mount middleware onto express

    await setupAuth(expressApp);
    app.enableCors({
        origin: process.env.FRONTEND_URL ||
            'http://localhost:3000', credentials: true
    });
    const port = parseInt(process.env.PORT || '5001', 10);
    await app.listen(port);
    console.log(`Nest app listening on http://localhost:${port}`);
}
bootstrap();