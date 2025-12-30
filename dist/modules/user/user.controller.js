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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorater_1 = require("../../common/decorators/roles.decorater");
const client_1 = require("@prisma/client");
const ApproveHouseholdChange_1 = require("./ApproveHouseholdChange");
const update_account_1 = require("./dto/update-account");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    create(data) {
        return this.userService.createUser(data);
    }
    updateRole(id, dto) {
        return this.userService.updateRole(id, dto);
    }
    createAccounts(num) {
        return this.userService.createAccounts(num);
    }
    getUsers(page = 1, limit = 10, search, state) {
        return this.userService.getUsers(page, limit, search, state);
    }
    getSetting(req) {
        return this.userService.getSetting(req.user.id);
    }
    updateAccount(req, dto) {
        return this.userService.updateAccount(Number(req.user.id), dto);
    }
    deleteAccount(req) {
        return this.userService.deleteAccount(req.user.id);
    }
    setRole(userId, role) {
        return this.userService.setRole(userId, role);
    }
    getDetails(id) {
        return this.userService.userDetails(id);
    }
    deleteMany(ids) {
        return this.userService.deleteUsers(ids);
    }
    resetPassword(id) {
        return this.userService.resetPassword(id);
    }
    approveHouseholdChange(id, body, req) {
        return this.userService.approveHouseholdChange(req.user.id, id, body.state, body.reason);
    }
    getDetailsHouseholdChange(householdId) {
        return this.userService.getDetailsHouseholdChange(householdId);
    }
    getDetailsResidentChange(residentId) {
        return this.userService.getDetailsResidentChanges(residentId);
    }
    approveResidentChange(id, body, req) {
        return this.userService.approveResidentChange(req.user.id, id, body.state, body.reason);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/update-role'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Post)('/create-accounts'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)('num', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createAccounts", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('state', new common_1.ParseEnumPipe(client_1.State, { optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/setting'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getSetting", null);
__decorate([
    (0, common_1.Patch)('/setting/update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_account_1.UpdateAccountDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateAccount", null);
__decorate([
    (0, common_1.Delete)('/delete-account'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Patch)('role-update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setRole", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getDetails", null);
__decorate([
    (0, common_1.Delete)('/delete'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)('ids')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Post)('/reset-password/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('/approve-household-change/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ApproveHouseholdChange_1.ApproveHouseholdChangeDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "approveHouseholdChange", null);
__decorate([
    (0, common_1.Get)('/details-household-change/:householdId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('householdId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getDetailsHouseholdChange", null);
__decorate([
    (0, common_1.Get)('/details-resident-change/:residentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('residentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getDetailsResidentChange", null);
__decorate([
    (0, common_1.Post)('/approve-resident-change/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorater_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ApproveHouseholdChange_1.ApproveHouseholdChangeDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "approveResidentChange", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map