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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("./permission.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
let PermissionController = class PermissionController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    create(dto) {
        return this.permissionService.create(dto);
    }
    findAll(page, limit, staffId, department, fromDate, toDate, month) {
        return this.permissionService.findAll(page, limit, staffId, department, fromDate, toDate, month);
    }
    update(id, dto) {
        return this.permissionService.update(id, dto);
    }
    remove(id) {
        return this.permissionService.remove(id);
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin', 'staff'),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('staffId')),
    __param(3, (0, common_1.Query)('department')),
    __param(4, (0, common_1.Query)('fromDate')),
    __param(5, (0, common_1.Query)('toDate')),
    __param(6, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "remove", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('permission'),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map