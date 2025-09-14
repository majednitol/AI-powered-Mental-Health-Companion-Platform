import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AiService } from '../ai/ai.service';
import { storage } from '../storage/storage.impl';
@Controller('api/analytics')
export class AnalyticsController {
    constructor(private ai: AiService) { }
    @UseGuards(AuthGuard)
    @Get('insights')
    async insights(@Req() req: any) {
        const userId = req.user.claims.sub;
        const journals = await storage.getJournalEntries(userId, 10);
        const moods = await storage.getMoodEntries(userId, 30);
        const insights = await this.ai.generateJournalInsights(
            journals.map(j => ({
                title: j.title, content: j.content, moodRating:
                    j.moodRating, tags: j.tags
            })),
            moods.map(m => ({ moodScale: m.moodScale, emotions: m.emotions }))
        );
        return insights;
    }
    @UseGuards(AuthGuard)
    @Get('stats')
    async stats(@Req() req: any) {
        const userId = req.user.claims.sub;
        const moods = await storage.getMoodEntries(userId, 30);
        const journals = await storage.getJournalEntries(userId, 100);
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
        const weekMoods = moods.filter(m => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(m.date) >= weekAgo;
        });
        const monthMoods = moods.filter(m => {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            return new Date(m.date) >= monthAgo;
        });
        const weeklyAverage = weekMoods.length > 0 ? weekMoods.reduce((s, m) => s +
            m.moodScale, 0) / weekMoods.length : 0;
        const monthlyAverage = monthMoods.length > 0 ? monthMoods.reduce((s, m) => s
            + m.moodScale, 0) / monthMoods.length : 0;
        return {
            currentStreak,
            weeklyAverage: Math.round(weeklyAverage * 10) / 10,
            monthlyAverage: Math.round(monthlyAverage * 10) / 10,
            totalJournalEntries: journals.length,
            totalMoodEntries: moods.length,
            weeklyJournalEntries: journals.filter(j => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(j.createdAt || 0) >= weekAgo;
            }).length,
        };
    }
}