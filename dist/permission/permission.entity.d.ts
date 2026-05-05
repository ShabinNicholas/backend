import { Staff } from '../staff/staff.entity';
export declare class Permission {
    id: string;
    staffId: string;
    staff: Staff;
    date: string;
    hours: number;
    reason: string;
    createdAt: Date;
}
