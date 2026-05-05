import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    create(dto: CreateStaffDto): Promise<import("./staff.entity").Staff>;
    findAll(page: number, limit: number, search?: string, department?: string, status?: string): Promise<{
        data: import("./staff.entity").Staff[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./staff.entity").Staff>;
    update(id: string, dto: UpdateStaffDto): Promise<import("./staff.entity").Staff>;
    remove(id: string): Promise<void>;
}
