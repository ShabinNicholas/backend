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
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leave_entity_1 = require("./leave.entity");
let LeaveService = class LeaveService {
    constructor(leaveRepo) {
        this.leaveRepo = leaveRepo;
    }
    async create(dto) {
        const leave = this.leaveRepo.create(dto);
        return this.leaveRepo.save(leave);
    }
    async findAll(page = 1, limit = 10, staffId, department, fromDate, toDate, month, status) {
        const qb = this.leaveRepo
            .createQueryBuilder('leave')
            .leftJoinAndSelect('leave.staff', 'staff');
        if (staffId)
            qb.andWhere('leave.staffId = :staffId', { staffId });
        if (department)
            qb.andWhere('staff.department = :department', { department });
        if (status)
            qb.andWhere('leave.status = :status', { status });
        if (fromDate)
            qb.andWhere('leave.startDate >= :fromDate', { fromDate });
        if (toDate)
            qb.andWhere('leave.endDate <= :toDate', { toDate });
        if (month) {
            qb.andWhere("TO_CHAR(leave.startDate, 'YYYY-MM') = :month", { month });
        }
        qb.orderBy('leave.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findByStaff(staffId) {
        return this.leaveRepo.find({
            where: { staffId },
            order: { createdAt: 'DESC' },
        });
    }
    async updateStatus(id, dto) {
        const leave = await this.leaveRepo.findOne({ where: { id } });
        if (!leave)
            throw new common_1.NotFoundException('Leave not found');
        leave.status = dto.status;
        return this.leaveRepo.save(leave);
    }
    async update(id, dto) {
        const leave = await this.leaveRepo.findOne({ where: { id } });
        if (!leave)
            throw new common_1.NotFoundException('Leave not found');
        Object.assign(leave, dto);
        return this.leaveRepo.save(leave);
    }
    async remove(id) {
        const leave = await this.leaveRepo.findOne({ where: { id } });
        if (!leave)
            throw new common_1.NotFoundException('Leave not found');
        await this.leaveRepo.remove(leave);
    }
    async countThisMonth() {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return this.leaveRepo
            .createQueryBuilder('leave')
            .where("TO_CHAR(leave.startDate, 'YYYY-MM') = :month", { month })
            .andWhere("leave.status != 'rejected'")
            .getCount();
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leave_entity_1.Leave)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeaveService);
//# sourceMappingURL=leave.service.js.map