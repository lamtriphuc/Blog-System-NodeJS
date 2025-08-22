import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { ResponseData } from "src/global/globalClass";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@Controller('api/dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('stats')
    async getStats() {
        const res = await this.dashboardService.getStats();
        return new ResponseData(res, HttpStatus.OK, 'Lấy kết quả thành công');
    }
}
