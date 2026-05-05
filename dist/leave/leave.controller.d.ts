import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
export declare class LeaveController {
    private readonly leaveService;
    constructor(leaveService: LeaveService);
    create(dto: CreateLeaveDto, req: any): Promise<import("./leave.entity").Leave>;
    findAll(page: number, limit: number, staffId?: string, department?: string, fromDate?: string, toDate?: string, month?: string, status?: string): Promise<{
        data: import("./leave.entity").Leave[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByStaff(staffId: string): Promise<import("./leave.entity").Leave[]>;
    updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<import("./leave.entity").Leave>;
    update(id: string, dto: Partial<CreateLeaveDto>): Promise<import("./leave.entity").Leave>;
    remove(id: string): Promise<void>;
}
