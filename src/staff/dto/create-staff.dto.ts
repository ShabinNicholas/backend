import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StaffStatus } from '../staff.entity';

export class CreateStaffDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  dateOfJoining?: string;

  @IsOptional()
  @IsEnum(StaffStatus)
  status?: StaffStatus;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  userRole?: string;
}
