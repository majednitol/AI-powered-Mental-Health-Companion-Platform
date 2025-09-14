import { Controller, Post, Get, Body, Req, UseGuards, Query } from
    '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { storage } from '../storage/storage.impl';
import { AiService } from '../ai/ai.service';
@Controller('api/chat')
export class ChatController {
    constructor(private ai: AiService) { }
    @UseGuards(AuthGuard)
    @Post('message')
    async send(@Req() req: any, @Body() body: any) {
        const userId = req.user.claims.sub;
        const { message } = body;
        if (!message || typeof message !== 'string') {
            return { status: 400, message: 'Message is required' };
        }
        await storage.createChatMessage({
            userId, message, response: null,
            isFromUser: true
        } as any);
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
        const aiResponse = await this.ai.generateChatResponse(message, context);
        const chatMessage = await storage.createChatMessage({
            userId, message:
                aiResponse, response: null, isFromUser: false
        } as any);
        return { response: aiResponse, messageId: chatMessage.id };
    }
    @UseGuards(AuthGuard)
    @Get('messages')
    async messages(@Req() req: any, @Query('limit') limit?: string) {
        const userId = req.user.claims.sub;
        const l = limit ? parseInt(limit, 10) : undefined;
        const messages = await storage.getChatMessages(userId, l);
        return messages.reverse();
    }
}