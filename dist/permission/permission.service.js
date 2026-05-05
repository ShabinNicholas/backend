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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./permission.entity");
let PermissionService = class PermissionService {
    constructor(permRepo) {
        this.permRepo = permRepo;
    }
    async create(dto) {
        const perm = this.permRepo.create(dto);
        return this.permRepo.save(perm);
    }
    async findAll(page = 1, limit = 10, staffId, department, fromDate, toDate, month) {
        const qb = this.permRepo
            .createQueryBuilder('perm')
            .leftJoinAndSelect('perm.staff', 'staff');
        if (staffId)
            qb.andWhere('perm.staffId = :staffId', { staffId });
        if (department)
            qb.andWhere('staff.department = :department', { department });
        if (fromDate)
            qb.andWhere('perm.date >= :fromDate', { fromDate });
        if (toDate)
            qb.andWhere('perm.date <= :toDate', { toDate });
        if (month) {
            qb.andWhere("TO_CHAR(perm.date, 'YYYY-MM') = :month", { month });
        }
        qb.orderBy('perm.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async totalHoursThisMonth() {
        const now = new Date();
        const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const result = await this.permRepo
            .createQueryBuilder('perm')
            .select('SUM(perm.hours)', 'total')
            .where("TO_CHAR(perm.date, 'YYYY-MM') = :month", { month })
            .getRawOne();
        return parseFloat(result?.total || '0');
    }
    async update(id, dto) {
        const perm = await this.permRepo.findOne({ where: { id } });
        if (!perm)
            throw new common_1.NotFoundException('Permission not found');
        Object.assign(perm, dto);
        return this.permRepo.save(perm);
    }
    async remove(id) {
        const perm = await this.permRepo.findOne({ where: { id } });
        if (!perm)
            throw new common_1.NotFoundException('Permission not found');
        await this.permRepo.remove(perm);
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map