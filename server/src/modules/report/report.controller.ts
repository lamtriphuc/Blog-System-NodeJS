import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ResponseData } from "src/global/globalClass";
import { ResponseReportDto } from "./dto/response-report.dto";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@Controller('api/reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createReportDto: CreateReportDto,
        @Req() req
    ): Promise<ResponseData<ResponseReportDto>> {
        const userId = req.user.id;
        const report = await this.reportService.create(createReportDto, userId);
        return new ResponseData(report, HttpStatus.CREATED, 'Tạo báo cáo thành công');
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 5
    ) {
        const res = await this.reportService.findAll(page, limit);
        return new ResponseData(res, HttpStatus.OK, 'Lấy báo cáo thành công');
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async deleteReport(
        @Param('id') id: number
    ): Promise<ResponseData<null>> {
        await this.reportService.deleteReport(id);
        return new ResponseData(null, HttpStatus.OK, 'Xóa báo cáo thành công');
    }
}