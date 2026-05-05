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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles('admin', 'staff')
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
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
  ) {
    return this.permissionService.findAll(page, limit, staffId, department, fromDate, toDate, month);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: Partial<CreatePermissionDto>) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
