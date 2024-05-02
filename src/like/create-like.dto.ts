import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LikeCreateDto {
  @Field()
  postId: number;

  @Field()
  userId: number;
}
