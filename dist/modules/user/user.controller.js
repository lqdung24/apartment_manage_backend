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
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorater_1 = require("../../common/decorators/roles.decorater");
const client_1 = require("@prisma/client");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    updateRole(id, dto) {
        return this.userService.updateRole(id, dto);
    }
};
exports.UserController = UserController;
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
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map