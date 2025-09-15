import { Module } from '@nestjs/common';
import { MoodResolver } from './mood.resolver';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [StorageModule, AuthModule],
  providers: [MoodResolver],
})
export class MoodModule {}
