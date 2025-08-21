import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "src/entities/post.entity";
import { ReportEntity } from "src/entities/report.entity";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dto/create-report.dto";
import { ResponseReportDto } from "./dto/response-report.dto";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportEntity)
        private readonly reportRepo: Repository<ReportEntity>,

        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) { }

    async create(dto: CreateReportDto, userId: number) {
        const post = await this.postRepo.findOne({
            where: { id: dto.postId }
        });
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        const user = await this.userRepo.findOne({
            where: { id: userId }
        });
        if (!user) throw new NotFoundException('Người dùng không tồn tại');

        const report = this.reportRepo.create({ reason: dto.reason, post, user });
        await this.reportRepo.save(report);
        return new ResponseReportDto(report);
    }

    async findAll(page: number, limit: number) {
        const [reports, total] = await this.reportRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['user', 'post'],
            order: { createdAt: 'DESC' }
        });
        const result = reports.map(rp => new ResponseReportDto(rp));
        return {
            reports: result,
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        };
    }

    async deleteReport(id: number): Promise<void> {
        const report = await this.reportRepo.findOne({ where: { id } });
        if (!report) {
            throw new NotFoundException(`Report với id ${id} không tồn tại`);
        }
        await this.reportRepo.remove(report);
    }
}