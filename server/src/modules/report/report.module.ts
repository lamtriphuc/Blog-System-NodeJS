import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostEntity } from "src/entities/post.entity";
import { ReportEntity } from "src/entities/report.entity";
import { UserEntity } from "src/entities/user.entity";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

@Module({
    imports: [TypeOrmModule.forFeature([ReportEntity, PostEntity, UserEntity])],
    controllers: [ReportController],
    providers: [ReportService]
})

export class ReportModule { }