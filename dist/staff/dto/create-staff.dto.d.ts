import { StaffStatus } from '../staff.entity';
export declare class CreateStaffDto {
    fullName: string;
    email: string;
    phone?: string;
    role?: string;
    department?: string;
    dateOfJoining?: string;
    status?: StaffStatus;
    password?: string;
    userRole?: string;
}
