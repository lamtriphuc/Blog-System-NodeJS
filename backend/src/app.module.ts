import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './testdb/Database.service';
import { PostsModule } from './modules/posts/posts.module';
import { PostEntity } from './entities/post.entity';
import { UserEntity } from './entities/user.entity';
import { CommentEntity } from './entities/comment.entity';
import { VoteEntity } from './entities/vote.entity';
import { SavedPostEntity } from './entities/saved-post.entity';
import { PostImageEntity } from './entities/post-image.entity';
import { TagEntity } from './entities/tag.entity';
import { UsersModule } from './modules/users/users.module';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity, PostEntity, CommentEntity, VoteEntity, SavedPostEntity, PostImageEntity, TagEntity],
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes(
        {
          path: '/users',
          method: RequestMethod.GET
        },
        {
          path: '/products',
          method: RequestMethod.POST
        }
      )
  }
}
