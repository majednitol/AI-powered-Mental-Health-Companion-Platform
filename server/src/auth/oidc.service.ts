import * as client from 'openid-client';
import memoize from 'memoizee';
import { Injectable, Logger } from '@nestjs/common';

const requiredEnv = [
  'ISSUER_URL',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'CALLBACK_URL',
  'SESSION_SECRET',
  'DATABASE_URL',
];
requiredEnv.forEach(k => {
  if (!process.env[k]) throw new Error(`Environment variable ${k} is required`);
});

@Injectable()
export class OidcService {
  private readonly logger = new Logger(OidcService.name);

  private getOidcConfig = memoize(async () => {
    this.logger.log(`Discovering OIDC issuer at ${process.env.ISSUER_URL}`);

    // Correct way to discover issuer
    const issuer = await client.Issuer.discover(process.env.ISSUER_URL!);

    this.logger.log(`Issuer discovered: ${issuer.metadata.issuer}`);

    // Create client instance
    const clientInstance = new issuer.Client({
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      redirect_uris: [process.env.CALLBACK_URL!],
      response_types: ['code'],
    });

    return { issuer, client: clientInstance };
  }, { maxAge: 3600 * 1000 });

  async getConfig() {
    return this.getOidcConfig();
  }

  // Build logout url using client.endSessionUrl
  buildEndSessionUrl(params: Record<string, string>) {
    return this.getOidcConfig().then(({ client }) => client.endSessionUrl(params));
  }

  async refreshTokenGrant(refreshToken: string) {
    const { client } = await this.getOidcConfig();
    return client.refresh(refreshToken);
  }
}
