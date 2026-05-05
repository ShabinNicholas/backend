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
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Get()
  @Roles('admin', 'staff')
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('department') department?: string,
    @Query('status') status?: string,
  ) {
    return this.staffService.findAll(page, limit, search, department, status);
  }

  @Get(':id')
  @Roles('admin', 'staff')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateStaffDto) {
    return this.staffService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
