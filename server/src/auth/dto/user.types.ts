import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class UserObject {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) profileImageUrl?: string;
}