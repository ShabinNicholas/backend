import { LeaveType, LeaveStatus, HalfDayPeriod } from '../leave.entity';
export declare class CreateLeaveDto {
    staffId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason?: string;
    isHalfDay?: boolean;
    halfDayPeriod?: HalfDayPeriod;
    status?: LeaveStatus;
}
