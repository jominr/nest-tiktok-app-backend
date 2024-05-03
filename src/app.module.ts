import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { UserResolver } from './user/user.resolver';
import { PrismaService } from './prisma.service';
import { PostModule } from './post/post.module';
import { LikeModule } from './like/like.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommentModule } from './comment/comment.module';
/*
  `app.module`: 是 NestJS 应用程序的根模块，它定义了应用程序的各种模块、控制器和提供者。
  在 `app.module` 中，你可以导入其他模块、定义应用程序的全局中间件和全局提供者，以及配置应用程序的全局选项。
*/
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // This points to the public folder where your static files are located
      serveRoot: '/', // this means files will be available under 'http://localhost:3000/files/'
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({}),
    AuthModule,
    UserModule,
    PostModule,
    LikeModule,
    CommentModule,

  ],
  controllers: [AppController],
  providers: [AppService, UserResolver, UserService, PrismaService,],
})
export class AppModule {}
