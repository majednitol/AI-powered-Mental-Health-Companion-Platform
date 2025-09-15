import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AiService } from '../ai/ai.service';
import { storage } from '../storage/storage.impl';
import { AiInsights } from '../ai/dto/ai-insights.object';
import { AnalyticsStats } from './dto/analytics-stats.object';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly ai: AiService) {}

  @UseGuards(AuthGuard)
  @Query(() => AiInsights)
  async analyticsInsights(@Context() ctx: any): Promise<AiInsights> {
    const userId = ctx.req.user.claims.sub;

    const journals = await storage.getJournalEntries(userId, 10);
    const moods = await storage.getMoodEntries(userId, 30);

    return this.ai.generateJournalInsights(
      journals.map(j => ({
        title: j.title,
        content: j.content,
        moodRating: j.moodRating,
        tags: j.tags,
      })),
      moods.map(m => ({ moodScale: m.moodScale, emotions: m.emotions })),
    );
  }

  @UseGuards(AuthGuard)
  @Query(() => AnalyticsStats)
  async analyticsStats(@Context() ctx: any): Promise<AnalyticsStats> {
    const userId = ctx.req.user.claims.sub;

    const moods = await storage.getMoodEntries(userId, 30);
    const journals = await storage.getJournalEntries(userId, 100);

    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntry = moods.some(mood => {
        const moodDate = new Date(mood.date);
        return moodDate.toDateString() === checkDate.toDateString();
      });
      if (hasEntry) currentStreak++;
      else break;
    }

    // Weekly & monthly averages
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekMoods = moods.filter(m => new Date(m.date) >= weekAgo);

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthMoods = moods.filter(m => new Date(m.date) >= monthAgo);

    const weeklyAverage =
      weekMoods.length > 0
        ? weekMoods.reduce((s, m) => s + m.moodScale, 0) / weekMoods.length
        : 0;

    const monthlyAverage =
      monthMoods.length > 0
        ? monthMoods.reduce((s, m) => s + m.moodScale, 0) / monthMoods.length
        : 0;

    const weeklyJournalEntries = journals.filter(j => {
      return new Date(j.createdAt || 0) >= weekAgo;
    }).length;

    return {
      currentStreak,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      monthlyAverage: Math.round(monthlyAverage * 10) / 10,
      totalJournalEntries: journals.length,
      totalMoodEntries: moods.length,
      weeklyJournalEntries,
    };
  }
}
