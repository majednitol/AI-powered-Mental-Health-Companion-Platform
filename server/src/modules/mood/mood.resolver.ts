import { Resolver, Mutation, Query, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { storage } from '../storage/storage.impl';
import { MoodEntry } from './dto/mood.object';
import { CreateMoodInput } from './dto/create-mood.input';

@Resolver()
export class MoodResolver {
  @UseGuards(AuthGuard)
  @Mutation(() => MoodEntry)
  async createMoodEntry(
    @Context() ctx: any,
    @Args('data') data: CreateMoodInput,
  ): Promise<MoodEntry> {
    const userId = ctx.req.user.claims.sub;
    const moodData = {
      ...data,
      userId,
      date: data.date ? new Date(data.date) : new Date(),
    };

    const entry = await storage.createMoodEntry(moodData as any);

    // Explicitly add updatedAt
    return {
      ...entry,
      emotions: entry.emotions ?? undefined,
      notes: entry.notes ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: new Date(), // explicitly add it
    };
  }

  @UseGuards(AuthGuard)
  @Query(() => [MoodEntry])
  async moodEntries(
    @Context() ctx: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<MoodEntry[]> {
    const userId = ctx.req.user.claims.sub;
    const entries = await storage.getMoodEntries(userId, limit);

    return entries.map(entry => ({
      ...entry,
      emotions: entry.emotions ?? undefined,
      notes: entry.notes ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: new Date(), // explicitly add it
    }));
  }

  @UseGuards(AuthGuard)
  @Query(() => MoodEntry, { nullable: true })
  async todaysMoodEntry(@Context() ctx: any): Promise<MoodEntry | undefined> {
    const userId = ctx.req.user.claims.sub;
    const entry = await storage.getTodaysMoodEntry(userId);

    if (!entry) return undefined;

    return {
      ...entry,
      emotions: entry.emotions ?? undefined,
      notes: entry.notes ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: new Date(), // explicitly add it
    };
  }
}
