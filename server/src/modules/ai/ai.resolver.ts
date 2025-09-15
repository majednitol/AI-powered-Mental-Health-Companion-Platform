import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '../../auth/auth.guard';
import { storage } from '../storage/storage.impl';
import { AiInsights } from './dto/ai-insights.object';

@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  async chatResponse(
    @Context() ctx: any,
    @Args('message') message: string,
  ): Promise<string> {
    const userId = ctx.req.user.claims.sub;

    const recentJournals = await storage.getRecentJournalContext(userId, 3);
    const recentMoods = await storage.getMoodEntries(userId, 7);

    const context = {
      recentJournalEntries: recentJournals.map(entry => ({
        title: entry.title,
        content: entry.content,
        moodRating: entry.moodRating,
        tags: entry.tags,
        createdAt: entry.createdAt,
      })),
      recentMoodData: recentMoods.map(m => ({
        moodScale: m.moodScale,
        emotions: m.emotions,
        date: m.date,
      })),
    };

    return this.aiService.generateChatResponse(message, context);
  }

  @UseGuards(AuthGuard)
  @Query(() => AiInsights)
  async aiInsights(@Context() ctx: any): Promise<AiInsights> {
    const userId = ctx.req.user.claims.sub;

    const journals = await storage.getJournalEntries(userId, 10);
    const moods = await storage.getMoodEntries(userId, 30);

    return this.aiService.generateJournalInsights(
      journals.map(j => ({
        title: j.title,
        content: j.content,
        moodRating: j.moodRating,
        tags: j.tags,
      })),
      moods.map(m => ({
        moodScale: m.moodScale,
        emotions: m.emotions,
      })),
    );
  }
}
