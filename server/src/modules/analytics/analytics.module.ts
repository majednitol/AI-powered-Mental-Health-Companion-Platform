import { Module } from '@nestjs/common';
import { AnalyticsResolver } from './analytics.resolver';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [StorageModule, AiModule, AuthModule],
  providers: [AnalyticsResolver],
})
export class AnalyticsModule {}
