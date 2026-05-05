import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepo: Repository<Leave>,
  ) {}

  async create(dto: CreateLeaveDto): Promise<Leave> {
    const leave = this.leaveRepo.create(dto);
    return this.leaveRepo.save(leave);
  }

  async findAll(
    page = 1,
    limit = 10,
    staffId?: string,
    department?: string,
    fromDate?: string,
    toDate?: string,
    month?: string,
    status?: string,
  ) {
    const qb = this.leaveRepo
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.staff', 'staff');

    if (staffId) qb.andWhere('leave.staffId = :staffId', { staffId });
    if (department) qb.andWhere('staff.department = :department', { department });
    if (status) qb.andWhere('leave.status = :status', { status });
    if (fromDate) qb.andWhere('leave.startDate >= :fromDate', { fromDate });
    if (toDate) qb.andWhere('leave.endDate <= :toDate', { toDate });
    if (month) {
      qb.andWhere("TO_CHAR(leave.startDate, 'YYYY-MM') = :month", { month });
    }

    qb.orderBy('leave.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByStaff(staffId: string): Promise<Leave[]> {
    return this.leaveRepo.find({
      where: { staffId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, dto: UpdateLeaveStatusDto): Promise<Leave> {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('Leave not found');
    leave.status = dto.status;
    return this.leaveRepo.save(leave);
  }

  async update(id: string, dto: Partial<CreateLeaveDto>): Promise<Leave> {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('Leave not found');
    Object.assign(leave, dto);
    return this.leaveRepo.save(leave);
  }

  async remove(id: string): Promise<void> {
    const leave = await this.leaveRepo.findOne({ where: { id } });
    if (!leave) throw new NotFoundException('Leave not found');
    await this.leaveRepo.remove(leave);
  }

  async countThisMonth(): Promise<number> {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return this.leaveRepo
      .createQueryBuilder('leave')
      .where("TO_CHAR(leave.startDate, 'YYYY-MM') = :month", { month })
      .andWhere("leave.status != 'rejected'")
      .getCount();
  }
}
