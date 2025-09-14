import { Module } from '@nestjs/common';
import { DbModule } from './modules/db/db.module';
import { StorageModule } from './modules/storage/storage.module';
import { AiModule } from './modules/ai/ai.module';
import { MoodModule } from './modules/mood/mood.module';
import { JournalModule } from './modules/journal/journal.module';
import { ChatModule } from './modules/chat/chat.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DbModule,
        StorageModule,
        AiModule,
        AuthModule,
        MoodModule,
        JournalModule,
        ChatModule,
        AnalyticsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }