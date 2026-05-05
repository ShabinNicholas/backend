import { Repository } from 'typeorm';
import { Staff } from '../staff/staff.entity';
import { Leave } from '../leave/leave.entity';
import { Permission } from '../permission/permission.entity';
import { Response } from 'express';
export declare class ReportsService {
    private staffRepo;
    private leaveRepo;
    private permRepo;
    constructor(staffRepo: Repository<Staff>, leaveRepo: Repository<Leave>, permRepo: Repository<Permission>);
    getSummary(filters: {
        fromDate?: string;
        toDate?: string;
        month?: string;
        staffId?: string;
        department?: string;
    }): Promise<{
        leaveSummary: any[];
        permSummary: any[];
        monthlySummary: {
            month: string;
            totalLeaves: number;
            totalPermissionHours: number;
        }[];
    }>;
    exportCsv(filters: any, res: Response): Promise<void>;
    exportPdf(filters: any, res: Response): Promise<void>;
    getDashboard(): Promise<{
        totalStaff: number;
        leavesThisMonth: number;
        permHoursThisMonth: number;
    }>;
}
