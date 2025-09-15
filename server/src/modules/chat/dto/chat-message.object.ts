import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ChatMessage {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  message: string;

  @Field(() => String, { nullable: true }) // explicitly declare type
  response?: string; // use optional instead of string | null

  @Field(() => Boolean)
  isFromUser: boolean;

  @Field(() => Date) // if nullable, use { nullable: true }
  createdAt: Date;
}
