import { Field, ObjectType } from '@nestjs/graphql';

// 使用ObjectType decorator, mark the user class as graphql type, 
// 使用Field decorator, marks each of properties as a field of the graphql user type
// 之前是schema first approach, 现在也是code fist approach 
@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field()
  fullname: string;

  @Field()
  email?: string;
  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image: string;

  @Field()
  password: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}