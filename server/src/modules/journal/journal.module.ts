import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { StorageModule } from '../storage/storage.module';
import { AuthModule } from '../../auth/auth.module';
@Module({
    imports: [StorageModule, AuthModule],
    controllers: [JournalController],
})
export class JournalModule { }