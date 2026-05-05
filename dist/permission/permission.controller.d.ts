import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    create(dto: CreatePermissionDto): Promise<import("./permission.entity").Permission>;
    findAll(page: number, limit: number, staffId?: string, department?: string, fromDate?: string, toDate?: string, month?: string): Promise<{
        data: import("./permission.entity").Permission[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: string, dto: Partial<CreatePermissionDto>): Promise<import("./permission.entity").Permission>;
    remove(id: string): Promise<void>;
}
