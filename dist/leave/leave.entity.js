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
exports.Leave = exports.HalfDayPeriod = exports.LeaveStatus = exports.LeaveType = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("../staff/staff.entity");
var LeaveType;
(function (LeaveType) {
    LeaveType["SICK"] = "sick";
    LeaveType["CASUAL"] = "casual";
    LeaveType["PAID"] = "paid";
    LeaveType["UNPAID"] = "unpaid";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var LeaveStatus;
(function (LeaveStatus) {
    LeaveStatus["PENDING"] = "pending";
    LeaveStatus["APPROVED"] = "approved";
    LeaveStatus["REJECTED"] = "rejected";
})(LeaveStatus || (exports.LeaveStatus = LeaveStatus = {}));
var HalfDayPeriod;
(function (HalfDayPeriod) {
    HalfDayPeriod["FIRST_HALF"] = "first_half";
    HalfDayPeriod["SECOND_HALF"] = "second_half";
})(HalfDayPeriod || (exports.HalfDayPeriod = HalfDayPeriod = {}));
let Leave = class Leave {
};
exports.Leave = Leave;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Leave.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Leave.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, (staff) => staff.leaves, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'staffId' }),
    __metadata("design:type", staff_entity_1.Staff)
], Leave.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LeaveType }),
    __metadata("design:type", String)
], Leave.prototype, "leaveType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Leave.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Leave.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Leave.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Leave.prototype, "isHalfDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: HalfDayPeriod, nullable: true }),
    __metadata("design:type", String)
], Leave.prototype, "halfDayPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING }),
    __metadata("design:type", String)
], Leave.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Leave.prototype, "createdAt", void 0);
exports.Leave = Leave = __decorate([
    (0, typeorm_1.Entity)('leaves')
], Leave);
//# sourceMappingURL=leave.entity.js.map