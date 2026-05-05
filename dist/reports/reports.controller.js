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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let ReportsController = class ReportsController {
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getDashboard() {
        return this.reportsService.getDashboard();
    }
    getSummary(fromDate, toDate, month, staffId, department) {
        return this.reportsService.getSummary({ fromDate, toDate, month, staffId, department });
    }
    exportCsv(fromDate, toDate, month, staffId, department, res) {
        return this.reportsService.exportCsv({ fromDate, toDate, month, staffId, department }, res);
    }
    exportPdf(fromDate, toDate, month, staffId, department, res) {
        return this.reportsService.exportPdf({ fromDate, toDate, month, staffId, department }, res);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('staffId')),
    __param(4, (0, common_1.Query)('department')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('staffId')),
    __param(4, (0, common_1.Query)('department')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Get)('export/pdf'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __param(2, (0, common_1.Query)('month')),
    __param(3, (0, common_1.Query)('staffId')),
    __param(4, (0, common_1.Query)('department')),
    __param(5, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "exportPdf", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map