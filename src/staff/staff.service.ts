import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Staff } from './staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  async create(dto: CreateStaffDto): Promise<Staff> {
    const existing = await this.staffRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already exists');

    const staff = this.staffRepo.create(dto);
    if (dto.password) {
      staff.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    return this.staffRepo.save(staff);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    department?: string,
    status?: string,
  ) {
    const where: FindOptionsWhere<Staff>[] = [];

    if (search) {
      where.push({ fullName: Like(`%${search}%`) });
      where.push({ email: Like(`%${search}%`) });
    }

    const qb = this.staffRepo.createQueryBuilder('staff');
    if (search) {
      qb.where(
        'staff.fullName ILIKE :search OR staff.email ILIKE :search',
        { search: `%${search}%` },
      );
    }
    if (department) qb.andWhere('staff.department = :department', { department });
    if (status) qb.andWhere('staff.status = :status', { status });

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('staff.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepo.findOne({
      where: { id },
      relations: ['leaves', 'permissions'],
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async findByEmail(email: string): Promise<Staff | null> {
    return this.staffRepo.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    if (dto.password) {
      (dto as any).passwordHash = await bcrypt.hash(dto.password, 10);
      delete (dto as any).password;
    }
    Object.assign(staff, dto);
    return this.staffRepo.save(staff);
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepo.remove(staff);
  }

  async count(): Promise<number> {
    return this.staffRepo.count();
  }
}
