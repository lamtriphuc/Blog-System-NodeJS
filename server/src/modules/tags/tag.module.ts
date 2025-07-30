import { Module } from "@nestjs/common";
import { TagsService } from "./tag.service";
import { TagController } from "./tag.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "src/entities/tag.entity";
import { PostsService } from "../posts/posts.service";
import { PostsModule } from "../posts/posts.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([TagEntity]),
        PostsModule
    ],
    controllers: [TagController],
    providers: [TagsService],
    exports: [TagsService]
})
export class TagModule { }