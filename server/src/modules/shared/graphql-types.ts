import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) profileImageUrl?: string;
}

@ObjectType()
export class Journal {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() content: string;
  @Field(() => [String], { nullable: true }) tags?: string[];
  @Field(() => Int, { nullable: true }) moodRating?: number;
  @Field() createdAt: Date;
}
