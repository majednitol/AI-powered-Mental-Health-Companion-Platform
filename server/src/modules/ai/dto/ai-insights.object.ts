import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AiInsights {
  @Field(() => [String])
  insights: string[];

  @Field(() => [String])
  recommendations: string[];

  @Field(() => [String])
  patterns: string[];
}
