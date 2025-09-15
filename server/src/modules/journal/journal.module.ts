import { Module } from '@nestjs/common';
import { JournalResolver } from './journal.resolver';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [StorageModule, AuthModule],
  providers: [JournalResolver],
})
export class JournalModule {}
