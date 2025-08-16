import { ReportEntity } from "src/entities/report.entity";

export class ResponseReportDto {
    userId: number;
    postId: number;
    reason: string;

    constructor(report: ReportEntity) {
        this.userId = report.user.id;
        this.postId = report.post.id;
        this.reason = report.reason;
    }
}