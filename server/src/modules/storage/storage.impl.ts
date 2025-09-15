import { db } from '../db/db.export';
import {
  users,
  moodEntries,
  journalEntries,
  chatMessages,
  type User,
  type UpsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type ChatMessage,
  type InsertChatMessage,
} from '../../modules/shared/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  getMoodEntriesInRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MoodEntry[]>;
  getTodaysMoodEntry(userId: string): Promise<MoodEntry | undefined>;

  createJournalEntry(journalEntry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  getJournalEntry(id: string, userId: string): Promise<JournalEntry | undefined>;
  updateJournalEntry(
    id: string,
    userId: string,
    updates: Partial<InsertJournalEntry>,
  ): Promise<JournalEntry | undefined>;

  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  getRecentJournalContext(userId: string, limit?: number): Promise<JournalEntry[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: { ...userData, updatedAt: new Date() },
      })
      .returning();
    return user;
  }

  async createMoodEntry(moodEntry: InsertMoodEntry): Promise<MoodEntry> {
    const [entry] = await db.insert(moodEntries).values(moodEntry).returning();
    return entry;
  }

  async getMoodEntries(userId: string, limit = 30): Promise<MoodEntry[]> {
    return db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date))
      .limit(limit);
  }

  async getMoodEntriesInRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MoodEntry[]> {
    return db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.date, startDate),
          lte(moodEntries.date, endDate),
        ),
      )
      .orderBy(desc(moodEntries.date));
  }

  async getTodaysMoodEntry(userId: string): Promise<MoodEntry | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [entry] = await db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.date, today),
          lte(moodEntries.date, tomorrow),
        ),
      );
    return entry;
  }

  async createJournalEntry(
    journalEntry: InsertJournalEntry,
  ): Promise<JournalEntry> {
    const [entry] = await db
      .insert(journalEntries)
      .values(journalEntry)
      .returning();
    return entry;
  }

  async getJournalEntries(
    userId: string,
    limit = 10,
  ): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async getJournalEntry(
    id: string,
    userId: string,
  ): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
    return entry;
  }

  async updateJournalEntry(
    id: string,
    userId: string,
    updates: Partial<InsertJournalEntry>,
  ): Promise<JournalEntry | undefined> {
    const [entry] = await db
      .update(journalEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
      .returning();
    return entry;
  }

  async createChatMessage(
    chatMessage: InsertChatMessage,
  ): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(chatMessage)
      .returning();
    return message;
  }

  async getChatMessages(
    userId: string,
    limit = 50,
  ): Promise<ChatMessage[]> {
    return db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async getRecentJournalContext(
    userId: string,
    limit = 5,
  ): Promise<JournalEntry[]> {
    return db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
