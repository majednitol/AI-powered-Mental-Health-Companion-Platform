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
    const userMessage = await storage.createChatMessage({
      userId,
      message,
      response: null,
      isFromUser: true,
    } as any);

    const mappedUserMessage: ChatMessage = {
      ...userMessage,
      response: userMessage.response ?? undefined,
      createdAt: userMessage.createdAt ?? new Date(),
    };

    // Build AI context
    const recentJournals = await storage.getRecentJournalContext(userId, 3);
    const recentMoods = await storage.getMoodEntries(userId, 7);

    const context = {
      recentJournalEntries: recentJournals.map(entry => ({
        title: entry.title,
        content: entry.content,
        moodRating: entry.moodRating,
        tags: entry.tags ?? undefined,
        createdAt: entry.createdAt ?? new Date(),
      })),
      recentMoodData: recentMoods.map(m => ({
        moodScale: m.moodScale,
        emotions: m.emotions ?? undefined,
        date: m.date,
      })),
    };

    // Generate AI response
    const aiResponse = await this.ai.generateChatResponse(message, context);

    // Save AI reply
    const aiMessage = await storage.createChatMessage({
      userId,
      message: aiResponse,
      response: null,
      isFromUser: false,
    } as any);

    const mappedAiMessage: ChatMessage = {
      ...aiMessage,
      response: aiMessage.response ?? undefined,
      createdAt: aiMessage.createdAt ?? new Date(),
    };

    return mappedAiMessage;
  }

  @UseGuards(AuthGuard)
  @Query(() => [ChatMessage])
  async chatMessages(
    @Context() ctx: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<ChatMessage[]> {
    const userId = ctx.req.user.claims.sub;
    const messages = await storage.getChatMessages(userId, limit);

    return messages
      .map(msg => ({
        ...msg,
        response: msg.response ?? undefined,
        createdAt: msg.createdAt ?? new Date(),
      }))
      .reverse();
  }
}
