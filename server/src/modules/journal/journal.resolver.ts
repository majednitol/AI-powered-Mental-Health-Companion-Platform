import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { storage } from '../storage/storage.impl';
import { CreateJournalInput } from './dto/create-journal.input';
import { Journal } from './dto/journal.object';

@Resolver(() => Journal)
export class JournalResolver {
  @UseGuards(AuthGuard)
  @Mutation(() => Journal)
  async createJournal(
    @Context() ctx: any,
    @Args('data') data: CreateJournalInput,
  ): Promise<Journal> {
    const userId = ctx.req.user.claims.sub;
    const entry = await storage.createJournalEntry({ ...data, userId } as any);

    // Map null -> undefined or default values
    return {
      ...entry,
      tags: entry.tags ?? undefined,
      moodRating: entry.moodRating ?? undefined,
      isPrivate: entry.isPrivate ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: entry.updatedAt ?? undefined,
    };
  }

  @UseGuards(AuthGuard)
  @Query(() => [Journal])
  async journals(
    @Context() ctx: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Journal[]> {
    const userId = ctx.req.user.claims.sub;
    const entries = await storage.getJournalEntries(userId, limit);

    return entries.map(entry => ({
      ...entry,
      tags: entry.tags ?? undefined,
      moodRating: entry.moodRating ?? undefined,
      isPrivate: entry.isPrivate ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: entry.updatedAt ?? undefined,
    }));
  }

  @UseGuards(AuthGuard)
  @Query(() => Journal, { nullable: true })
  async journal(
    @Context() ctx: any,
    @Args('id') id: string,
  ): Promise<Journal | undefined> {
    const userId = ctx.req.user.claims.sub;
    const entry = await storage.getJournalEntry(id, userId);

    if (!entry) return undefined;

    return {
      ...entry,
      tags: entry.tags ?? undefined,
      moodRating: entry.moodRating ?? undefined,
      isPrivate: entry.isPrivate ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
      updatedAt: entry.updatedAt ?? undefined,
    };
  }
}
