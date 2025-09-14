import { Module } from '@nestjs/common';
import { MoodController } from './mood.controller';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from '../../auth/auth.module';
@Module({
    imports: [StorageModule, AuthModule],
    controllers: [MoodController],
})
export class MoodModule { }