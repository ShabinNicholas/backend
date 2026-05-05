import { Response } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDashboard(): Promise<{
        totalStaff: number;
        leavesThisMonth: number;
        permHoursThisMonth: number;
    }>;
    getSummary(fromDate?: string, toDate?: string, month?: string, staffId?: string, department?: string): Promise<{
        leaveSummary: any[];
        permSummary: any[];
        monthlySummary: {
            month: string;
            totalLeaves: number;
            totalPermissionHours: number;
        }[];
    }>;
    exportCsv(fromDate?: string, toDate?: string, month?: string, staffId?: string, department?: string, res?: Response): Promise<void>;
    exportPdf(fromDate?: string, toDate?: string, month?: string, staffId?: string, department?: string, res?: Response): Promise<void>;
}
