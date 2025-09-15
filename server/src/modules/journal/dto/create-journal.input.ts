// src/modules/journal/dto/create-journal.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateJournalInput {
  @Field() title: string;
  @Field() content: string;
  @Field(() => [String], { nullable: true }) tags?: string[];
  @Field(() => Int, { nullable: true }) moodRating?: number;
}
