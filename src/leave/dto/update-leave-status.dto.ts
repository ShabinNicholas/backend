import { IsEnum, IsNotEmpty } from 'class-validator';
import { LeaveStatus } from '../leave.entity';

export class UpdateLeaveStatusDto {
  @IsNotEmpty()
  @IsEnum(LeaveStatus)
  status: LeaveStatus;
}
