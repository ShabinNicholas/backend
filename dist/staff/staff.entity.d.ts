import { Leave } from '../leave/leave.entity';
import { Permission } from '../permission/permission.entity';
export declare enum StaffStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Staff {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    dateOfJoining: string;
    status: StaffStatus;
    passwordHash: string;
    userRole: string;
    leaves: Leave[];
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}
