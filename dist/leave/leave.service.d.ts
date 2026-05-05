import { Repository } from 'typeorm';
import { Leave } from './leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
export declare class LeaveService {
    private readonly leaveRepo;
    constructor(leaveRepo: Repository<Leave>);
    create(dto: CreateLeaveDto): Promise<Leave>;
    findAll(page?: number, limit?: number, staffId?: string, department?: string, fromDate?: string, toDate?: string, month?: string, status?: string): Promise<{
        data: Leave[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByStaff(staffId: string): Promise<Leave[]>;
    updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<Leave>;
    update(id: string, dto: Partial<CreateLeaveDto>): Promise<Leave>;
    remove(id: string): Promise<void>;
    countThisMonth(): Promise<number>;
}
