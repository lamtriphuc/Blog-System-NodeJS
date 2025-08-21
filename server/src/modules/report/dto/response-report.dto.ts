import { ReportEntity } from "src/entities/report.entity";

export class ResponseReportDto {
    reportId: number;
    userId: number;
    username: string;
    postId: number;
    reason: string;

    constructor(report: ReportEntity) {
        this.reportId = report.id;
        this.userId = report.user.id;
        this.username = report.user.username;
        this.postId = report.post.id;
        this.reason = report.reason;
    }
}