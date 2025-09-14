import { Injectable } from '@nestjs/common';
import { storage, DatabaseStorage, IStorage } from './storage.impl';

@Injectable()
export class StorageService implements IStorage {
  private readonly db: DatabaseStorage = storage;


  getUser(id: string) {
    return this.db.getUser(id);
  }

  upsertUser(user: any) {
    return this.db.upsertUser(user);
  }

  createMoodEntry(moodEntry: any) {
    return this.db.createMoodEntry(moodEntry);
  }

  getMoodEntries(userId: string, limit?: number) {
    return this.db.getMoodEntries(userId, limit);
  }

  getMoodEntriesInRange(userId: string, startDate: Date, endDate: Date) {
    return this.db.getMoodEntriesInRange(userId, startDate, endDate);
  }

  getTodaysMoodEntry(userId: string) {
    return this.db.getTodaysMoodEntry(userId);
  }

  createJournalEntry(journalEntry: any) {
    return this.db.createJournalEntry(journalEntry);
  }

  getJournalEntries(userId: string, limit?: number) {
    return this.db.getJournalEntries(userId, limit);
  }

  getJournalEntry(id: string, userId: string) {
    return this.db.getJournalEntry(id, userId);
  }

  updateJournalEntry(id: string, userId: string, updates: any) {
    return this.db.updateJournalEntry(id, userId, updates);
  }

  createChatMessage(chatMessage: any) {
    return this.db.createChatMessage(chatMessage);
  }

  getChatMessages(userId: string, limit?: number) {
    return this.db.getChatMessages(userId, limit);
  }

  getRecentJournalContext(userId: string, limit?: number) {
    return this.db.getRecentJournalContext(userId, limit);
  }
}
