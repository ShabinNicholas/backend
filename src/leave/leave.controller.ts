import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  Req,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { LeaveStatus } from './leave.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Roles('admin', 'staff')
  create(@Body() dto: CreateLeaveDto, @Req() req: any) {
    if (req.user?.userRole === 'admin') {
      if (!dto.status) dto.status = LeaveStatus.APPROVED;
    } else {
      dto.status = LeaveStatus.PENDING;
    }
    return this.leaveService.create(dto);
  }

  @Get()
  @Roles('admin', 'staff')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('staffId') staffId?: string,
    @Query('department') department?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('month') month?: string,
    @Query('status') status?: string,
  ) {
    return this.leaveService.findAll(page, limit, staffId, department, fromDate, toDate, month, status);
  }

  @Get('staff/:staffId')
  @Roles('admin', 'staff')
  findByStaff(@Param('staffId') staffId: string) {
    return this.leaveService.findByStaff(staffId);
  }

  @Put(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeaveStatusDto) {
    return this.leaveService.updateStatus(id, dto);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreateLeaveDto>) {
    return this.leaveService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(id);
  }
}
