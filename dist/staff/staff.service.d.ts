import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
export declare class StaffService {
    private readonly staffRepo;
    constructor(staffRepo: Repository<Staff>);
    create(dto: CreateStaffDto): Promise<Staff>;
    findAll(page?: number, limit?: number, search?: string, department?: string, status?: string): Promise<{
        data: Staff[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Staff>;
    findByEmail(email: string): Promise<Staff | null>;
    update(id: string, dto: UpdateStaffDto): Promise<Staff>;
    remove(id: string): Promise<void>;
    count(): Promise<number>;
}
