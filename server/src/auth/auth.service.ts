import { Injectable, OnModuleInit } from '@nestjs/common';
import { Issuer, Client } from 'openid-client';
import { StorageService } from '../modules/storage/storage.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private client: Client;

  constructor(private readonly storage: StorageService) { }

  async onModuleInit() {
    await this.initializeClient();
  }

  private async initializeClient() {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const callbackUrl = process.env.CALLBACK_URL;

    // Validate environment variables
    if (!clientId || !clientSecret || !callbackUrl) {
      throw new Error('CLIENT_ID, CLIENT_SECRET, and CALLBACK_URL must be defined in .env');
    }

    const googleIssuer = await Issuer.discover('https://accounts.google.com');
    this.client = new googleIssuer.Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [callbackUrl],
      response_types: ['code'],
    });
  }

  getClient(): Client {
    return this.client;
  }

  async getUser(userId: string) {
    return this.storage.getUser(userId);
  }

  async validateUser(profile: any) {
    const id = profile.id;
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const profileImageUrl = profile.photos?.[0]?.value;

    const user = {
      id,
      email,
      firstName,
      lastName,
      profileImageUrl,
    };

    await this.storage.upsertUser(user);

    return user;
  }


}
