import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "src/entities/post.entity";
import { ReportEntity } from "src/entities/report.entity";
import { TagEntity } from "src/entities/tag.entity";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";

// dashboard.service.ts
@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
        @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
        @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
        @InjectRepository(ReportEntity) private reportRepo: Repository<ReportEntity>,
    ) { }

    async getStats() {
        const [userCount, postCount, tagCount, reportCount] = await Promise.all([
            this.userRepo.count(),
            this.postRepo.count(),
            this.tagRepo.count(),
            this.reportRepo.count()
        ]);

        return {
            users: userCount,
            posts: postCount,
            tags: tagCount,
            reports: reportCount
        };
    }
}
