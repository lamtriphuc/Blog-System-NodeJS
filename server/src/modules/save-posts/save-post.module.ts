import { Module } from "@nestjs/common";
import { SavePostController } from "./save-post.controller";
import { SavePostService } from "./save-post.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SavedPostEntity } from "src/entities/saved-post.entity";
import { PostsModule } from "../posts/posts.module";
import { PostEntity } from "src/entities/post.entity";
import { CloudinaryService } from "src/common/services/cloudinary.service";

@Module({
    imports: [TypeOrmModule.forFeature([SavedPostEntity, PostEntity]), PostsModule],
    controllers: [SavePostController],
    providers: [SavePostService],
    exports: [SavePostService]
})

export class SavePostModule { }