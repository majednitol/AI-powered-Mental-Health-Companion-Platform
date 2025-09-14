import { Injectable } from '@nestjs/common';
import { StorageService } from '../modules/storage/storage.service';

@Injectable()
export class AuthService {
  constructor(private readonly storage: StorageService) {}

  async getUser(userId: string) {
    return this.storage.getUser(userId);
  }
}
