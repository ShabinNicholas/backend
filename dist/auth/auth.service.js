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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const staff_service_1 = require("../staff/staff.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(staffService, jwtService) {
        this.staffService = staffService;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const staff = await this.staffService.findByEmail(dto.email);
        if (!staff || !staff.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, staff.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const payload = {
            sub: staff.id,
            email: staff.email,
            userRole: staff.userRole,
            fullName: staff.fullName,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: staff.id,
                email: staff.email,
                fullName: staff.fullName,
                userRole: staff.userRole,
                department: staff.department,
                role: staff.role,
            },
        };
    }
    async seedAdmin() {
        const existing = await this.staffService.findByEmail('admin@foxtech.com');
        if (!existing) {
            await this.staffService.create({
                fullName: 'Admin User',
                email: 'admin@foxtech.com',
                password: 'admin123',
                userRole: 'admin',
                status: undefined,
            });
            console.log('✅ Admin seeded: admin@foxtech.com / admin123');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [staff_service_1.StaffService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map