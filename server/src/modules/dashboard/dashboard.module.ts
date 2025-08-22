import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "src/entities/post.entity";
import { ReportEntity } from "src/entities/report.entity";
import { TagEntity } from "src/entities/tag.entity";
import { UserEntity } from "src/entities/user.entity";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, PostEntity, TagEntity, ReportEntity]), // repo
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }