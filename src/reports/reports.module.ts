import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../staff/staff.entity';
import { Leave } from '../leave/leave.entity';
import { Permission } from '../permission/permission.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Leave, Permission])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
