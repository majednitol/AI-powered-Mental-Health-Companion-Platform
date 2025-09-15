import { Resolver, Mutation, Query, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { AiService } from '../ai/ai.service';
import { storage } from '../storage/storage.impl';
import { ChatMessage } from './dto/chat-message.object';

@Resolver()
export class ChatResolver {
  constructor(private readonly ai: AiService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ChatMessage)
  async sendMessage(
    @Context() ctx: any,
    @Args('message') message: string,
  ): Promise<ChatMessage> {
    const userId = ctx.req.user.claims.sub;

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required');
    }

    // Store user message
    await storage.createChatMessage({
      userId,
      message,
      response: null,
      isFromUser: true,
    } as any);

    // Build AI context
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

    // Generate AI response
    const aiResponse = await this.ai.generateChatResponse(message, context);

    // Save AI reply
    const chatMessage = await storage.createChatMessage({
      userId,
      message: aiResponse,
      response: null,
      isFromUser: false,
    } as any);

    return chatMessage;
  }

  @UseGuards(AuthGuard)
  @Query(() => [ChatMessage])
  async chatMessages(
    @Context() ctx: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<ChatMessage[]> {
    const userId = ctx.req.user.claims.sub;
    const messages = await storage.getChatMessages(userId, limit);
    return messages.reverse();
  }
}
