import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionService {
    private readonly permRepo;
    constructor(permRepo: Repository<Permission>);
    create(dto: CreatePermissionDto): Promise<Permission>;
    findAll(page?: number, limit?: number, staffId?: string, department?: string, fromDate?: string, toDate?: string, month?: string): Promise<{
        data: Permission[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    totalHoursThisMonth(): Promise<number>;
    update(id: string, dto: Partial<CreatePermissionDto>): Promise<Permission>;
    remove(id: string): Promise<void>;
}
