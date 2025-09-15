import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class MoodEntry {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field(() => Int)
  moodScale: number;

  @Field(() => [String], { nullable: true })
  emotions?: string[];

  @Field({ nullable: true })
  notes?: string;

  @Field()
  date: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
