import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class AnalyticsStats {
  @Field(() => Int)
  currentStreak: number;

  @Field(() => Float)
  weeklyAverage: number;

  @Field(() => Float)
  monthlyAverage: number;

  @Field(() => Int)
  totalJournalEntries: number;

  @Field(() => Int)
  totalMoodEntries: number;

  @Field(() => Int)
  weeklyJournalEntries: number;
}
