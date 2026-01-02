import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AiService {
  private genai: GoogleGenerativeAI | null = null;

  constructor() {
    const key = process.env.GENAI_API_KEY;
    if (!key) {
      console.warn(
        'GENAI_API_KEY not set. AI calls will fail until you set the key.',
      );
    } else {
      this.genai = new GoogleGenerativeAI(key);
    }
  }

  async generateChatResponse(
    userMessage: string,
    context: any,
  ): Promise<string> {
    if (!this.genai) {
      return 'AI not configured (GENAI_API_KEY missing).';
    }
    try {
      const systemPrompt = `You are Luna, a compassionate AI mental health companion.
You provide emotional support, active listening, and gentle guidance.`;

      const fullPrompt = `${systemPrompt}
User message: ${userMessage}
Context: ${JSON.stringify(context).slice(0, 2000)}`;

      const model = this.genai.getGenerativeModel({
        model: 'gemini-2.5-flash',
      });

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      return (
        response.response.text() ||
        "I'm here to listen. Could you tell me more about how you're feeling?"
      );
    } catch (error) {
      console.error('Gemini API error:', error);
      return "I'm having trouble processing your message right now. How about we try talking about something that's on your mind?";
    }
  }

  async generateJournalInsights(journalEntries: any[], moodData: any[]) {
    if (!this.genai) {
      return {
        insights: ['AI not configured.'],
        recommendations: ['Set GENAI_API_KEY in .env to enable insights.'],
        patterns: [],
      };
    }

    try {
      const prompt = `Analyze the following mental health data and provide insights...`;

      const model = this.genai.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.3 },
      });

      const responseText = response.response.text() || '{}';
      const jsonMatch = responseText.match(
        /```(?:json)?\s*(\{[\s\S]*\})\s*```/,
      );

      let jsonText = responseText;
      if (jsonMatch) jsonText = jsonMatch[1];

      try {
        const result = JSON.parse(jsonText);
        return {
          insights:
            result.insights || [
              'Your mood tracking shows commitment to self-awareness.',
            ],
          recommendations:
            result.recommendations || [
              'Continue your daily mood tracking practice.',
            ],
          patterns:
            result.patterns || [
              'Regular journaling appears to support your wellbeing.',
            ],
        };
      } catch {
        return {
          insights: ['Your consistent tracking shows great self-awareness.'],
          recommendations: ['Keep up your regular journaling practice.'],
          patterns: ['Maintaining routine appears beneficial for your wellbeing.'],
        };
      }
    } catch (error) {
      console.error('Analytics generation error:', error);
      return {
        insights: ['Your consistent tracking shows great self-awareness.'],
        recommendations: ['Keep up your regular journaling practice.'],
        patterns: ['Maintaining routine appears beneficial for your wellbeing.'],
      };
    }
  }
}
