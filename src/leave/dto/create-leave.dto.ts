import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeaveType, LeaveStatus, HalfDayPeriod } from '../leave.entity';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsString()
  staffId: string;

  @IsEnum(LeaveType)
  leaveType: LeaveType;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsBoolean()
  isHalfDay?: boolean;

  @IsOptional()
  @IsEnum(HalfDayPeriod)
  halfDayPeriod?: HalfDayPeriod;

  @IsOptional()
  @IsEnum(LeaveStatus)
  status?: LeaveStatus;
}
