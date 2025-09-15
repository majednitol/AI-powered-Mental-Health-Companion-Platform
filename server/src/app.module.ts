import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { DbModule } from './modules/db/db.module';
import { StorageModule } from './modules/storage/storage.module';
import { AiModule } from './modules/ai/ai.module';
import { MoodModule } from './modules/mood/mood.module';
import { JournalModule } from './modules/journal/journal.module';
import { ChatModule } from './modules/chat/chat.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql.schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      playground: true,
    }),
    DbModule,
    StorageModule,
    AiModule,
    AuthModule,
    MoodModule,
    JournalModule,
    ChatModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
