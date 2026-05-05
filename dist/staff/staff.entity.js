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
exports.Staff = exports.StaffStatus = void 0;
const typeorm_1 = require("typeorm");
const leave_entity_1 = require("../leave/leave.entity");
const permission_entity_1 = require("../permission/permission.entity");
var StaffStatus;
(function (StaffStatus) {
    StaffStatus["ACTIVE"] = "active";
    StaffStatus["INACTIVE"] = "inactive";
})(StaffStatus || (exports.StaffStatus = StaffStatus = {}));
let Staff = class Staff {
};
exports.Staff = Staff;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Staff.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Staff.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Staff.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "dateOfJoining", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE }),
    __metadata("design:type", String)
], Staff.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Staff.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'staff' }),
    __metadata("design:type", String)
], Staff.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => leave_entity_1.Leave, (leave) => leave.staff, { cascade: true }),
    __metadata("design:type", Array)
], Staff.prototype, "leaves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => permission_entity_1.Permission, (permission) => permission.staff, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Staff.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Staff.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Staff.prototype, "updatedAt", void 0);
exports.Staff = Staff = __decorate([
    (0, typeorm_1.Entity)('staff')
], Staff);
//# sourceMappingURL=staff.entity.js.map