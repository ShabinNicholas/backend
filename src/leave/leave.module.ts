import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from './leave.entity';
import { LeaveService } from './leave.service';
import { LeaveController } from './leave.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leave])],
  providers: [LeaveService],
  controllers: [LeaveController],
  exports: [LeaveService],
})
export class LeaveModule {}
