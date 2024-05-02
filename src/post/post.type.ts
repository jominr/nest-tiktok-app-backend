import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/user/user.model';
import { LikeType } from 'src/like/like.type'

@ObjectType()
export class PostType {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  video: string;
  @Field(() => User)
  user: User;

  @Field(() => [LikeType], { nullable: true })
  likes?: LikeType[];
}

@ObjectType()
export class PostDetails extends PostType {
  @Field(() => [Number], { nullable: true })
  otherPostIds?: number[];
}
