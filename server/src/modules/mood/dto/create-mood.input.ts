import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateMoodInput {
  @Field(() => Int)
  moodScale: number;

  @Field(() => [String], { nullable: true })
  emotions?: string[];

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  date?: string;
}