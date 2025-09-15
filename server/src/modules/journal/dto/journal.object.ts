// src/modules/journal/dto/journal.object.ts
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Journal {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => Int, { nullable: true })
  moodRating?: number;

  @Field({ nullable: true })
  isPrivate?: boolean;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
