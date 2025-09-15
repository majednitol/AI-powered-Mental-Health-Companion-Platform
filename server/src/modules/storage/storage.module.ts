import { Module, Global } from '@nestjs/common';
import { StorageService } from './storage.service';
import { DbModule } from '../db/db.module';

@Global()
@Module({
  imports: [DbModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
