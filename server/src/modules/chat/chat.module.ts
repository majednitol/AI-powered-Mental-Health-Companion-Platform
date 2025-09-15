import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [StorageModule, AiModule, AuthModule],
  providers: [ChatResolver],
})
export class ChatModule {}
