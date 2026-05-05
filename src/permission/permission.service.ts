import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const perm = this.permRepo.create(dto);
    return this.permRepo.save(perm);
  }

  async findAll(
    page = 1,
    limit = 10,
    staffId?: string,
    department?: string,
    fromDate?: string,
    toDate?: string,
    month?: string,
  ) {
    const qb = this.permRepo
      .createQueryBuilder('perm')
      .leftJoinAndSelect('perm.staff', 'staff');

    if (staffId) qb.andWhere('perm.staffId = :staffId', { staffId });
    if (department) qb.andWhere('staff.department = :department', { department });
    if (fromDate) qb.andWhere('perm.date >= :fromDate', { fromDate });
    if (toDate) qb.andWhere('perm.date <= :toDate', { toDate });
    if (month) {
      qb.andWhere("TO_CHAR(perm.date, 'YYYY-MM') = :month", { month });
    }

    qb.orderBy('perm.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async totalHoursThisMonth(): Promise<number> {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const result = await this.permRepo
      .createQueryBuilder('perm')
      .select('SUM(perm.hours)', 'total')
      .where("TO_CHAR(perm.date, 'YYYY-MM') = :month", { month })
      .getRawOne();
    return parseFloat(result?.total || '0');
  }

  async update(id: string, dto: Partial<CreatePermissionDto>): Promise<Permission> {
    const perm = await this.permRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    Object.assign(perm, dto);
    return this.permRepo.save(perm);
  }

  async remove(id: string): Promise<void> {
    const perm = await this.permRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permission not found');
    await this.permRepo.remove(perm);
  }
}
