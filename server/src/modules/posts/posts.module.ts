import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { TagEntity } from 'src/entities/tag.entity';
import { PostImageEntity } from 'src/entities/post-image.entity';
import { TagModule } from '../tags/tag.module';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    PostEntity,
    UserEntity,
    TagEntity,
    PostImageEntity,
  ])],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService],
  exports: [PostsService]
})
export class PostsModule { }
