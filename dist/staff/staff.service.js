"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const bcrypt = require("bcryptjs");
let StaffService = class StaffService {
    constructor(staffRepo) {
        this.staffRepo = staffRepo;
    }
    async create(dto) {
        const existing = await this.staffRepo.findOne({
            where: { email: dto.email },
        });
        if (existing)
            throw new common_1.ConflictException('Email already exists');
        const staff = this.staffRepo.create(dto);
        if (dto.password) {
            staff.passwordHash = await bcrypt.hash(dto.password, 10);
        }
        return this.staffRepo.save(staff);
    }
    async findAll(page = 1, limit = 10, search, department, status) {
        const where = [];
        if (search) {
            where.push({ fullName: (0, typeorm_2.Like)(`%${search}%`) });
            where.push({ email: (0, typeorm_2.Like)(`%${search}%`) });
        }
        const qb = this.staffRepo.createQueryBuilder('staff');
        if (search) {
            qb.where('staff.fullName ILIKE :search OR staff.email ILIKE :search', { search: `%${search}%` });
        }
        if (department)
            qb.andWhere('staff.department = :department', { department });
        if (status)
            qb.andWhere('staff.status = :status', { status });
        qb.skip((page - 1) * limit).take(limit);
        qb.orderBy('staff.createdAt', 'DESC');
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const staff = await this.staffRepo.findOne({
            where: { id },
            relations: ['leaves', 'permissions'],
        });
        if (!staff)
            throw new common_1.NotFoundException('Staff not found');
        return staff;
    }
    async findByEmail(email) {
        return this.staffRepo.findOne({ where: { email } });
    }
    async update(id, dto) {
        const staff = await this.findOne(id);
        if (dto.password) {
            dto.passwordHash = await bcrypt.hash(dto.password, 10);
            delete dto.password;
        }
        Object.assign(staff, dto);
        return this.staffRepo.save(staff);
    }
    async remove(id) {
        const staff = await this.findOne(id);
        await this.staffRepo.remove(staff);
    }
    async count() {
        return this.staffRepo.count();
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StaffService);
//# sourceMappingURL=staff.service.js.map