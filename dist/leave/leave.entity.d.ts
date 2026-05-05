import { Staff } from '../staff/staff.entity';
export declare enum LeaveType {
    SICK = "sick",
    CASUAL = "casual",
    PAID = "paid",
    UNPAID = "unpaid"
}
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum HalfDayPeriod {
    FIRST_HALF = "first_half",
    SECOND_HALF = "second_half"
}
export declare class Leave {
    id: string;
    staffId: string;
    staff: Staff;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    isHalfDay: boolean;
    halfDayPeriod: HalfDayPeriod;
    status: LeaveStatus;
    createdAt: Date;
}
