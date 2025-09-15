import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ChatMessage {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  message: string;

  @Field({ nullable: true })
  response?: string;

  @Field()
  isFromUser: boolean;

  @Field()
  createdAt: Date;
}
