import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, varchar, text, integer, boolean }
    from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { relations } from 'drizzle-orm';
export const sessions = pgTable('sessions', {
    sid: varchar('sid').primaryKey(),
    sess: jsonb('sess').notNull(),
    expire: timestamp('expire').notNull(),
}, (t) => [index('IDX_session_expire').on(t.expire)]);
export const users = pgTable('users', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    email: varchar('email').unique(),
    firstName: varchar('first_name'),
    lastName: varchar('last_name'),
    profileImageUrl: varchar('profile_image_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const moodEntries = pgTable('mood_entries', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, {
        onDelete:
            'cascade'
    }),
    date: timestamp('date').notNull().defaultNow(),
    moodScale: integer('mood_scale').notNull(),
    emotions: text('emotions').array(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
});
export const journalEntries = pgTable('journal_entries', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, {
        onDelete:
            'cascade'
    }),
    title: varchar('title').notNull(),
    content: text('content').notNull(),
    tags: text('tags').array(),
    moodRating: integer('mood_rating'),
    isPrivate: boolean('is_private').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
export const chatMessages = pgTable('chat_messages', {
    id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar('user_id').notNull().references(() => users.id, {
        onDelete:
            'cascade'
    }),
    message: text('message').notNull(),
    response: text('response'),
    isFromUser: boolean('is_from_user').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
export const usersRelations = relations(users, ({ many }) => ({
    moodEntries: many(moodEntries),
    journalEntries: many(journalEntries),
    chatMessages: many(chatMessages),
}));
export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
    user: one(users, { fields: [moodEntries.userId], references: [users.id] }),
}));
export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
    user: one(users, {
        fields: [journalEntries.userId], references: [users.id]
    }),
}));
export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
    user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
}));
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
    id: true, createdAt: true
});
export const insertJournalEntrySchema =
    createInsertSchema(journalEntries).omit({
        id: true, createdAt: true,
        updatedAt: true
    });
export const insertChatMessageSchema =
    createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;