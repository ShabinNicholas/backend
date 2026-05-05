import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Roles('admin', 'staff')
  getDashboard() {
    return this.reportsService.getDashboard();
  }

  @Get()
  @Roles('admin')
  getSummary(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('month') month?: string,
    @Query('staffId') staffId?: string,
    @Query('department') department?: string,
  ) {
    return this.reportsService.getSummary({ fromDate, toDate, month, staffId, department });
  }

  @Get('export/csv')
  @Roles('admin')
  exportCsv(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('month') month?: string,
    @Query('staffId') staffId?: string,
    @Query('department') department?: string,
    @Res() res?: Response,
  ) {
    return this.reportsService.exportCsv({ fromDate, toDate, month, staffId, department }, res);
  }

  @Get('export/pdf')
  @Roles('admin')
  exportPdf(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('month') month?: string,
    @Query('staffId') staffId?: string,
    @Query('department') department?: string,
    @Res() res?: Response,
  ) {
    return this.reportsService.exportPdf({ fromDate, toDate, month, staffId, department }, res);
  }
}
