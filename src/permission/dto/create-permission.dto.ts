import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  staffId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(12)
  hours: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
