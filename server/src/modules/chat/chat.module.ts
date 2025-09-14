import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../../auth/auth.module';
@Module({
    imports: [StorageModule, AiModule, AuthModule],
    controllers: [ChatController],
})
export class ChatModule { }