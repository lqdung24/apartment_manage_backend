"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./shared/prisma/prisma.module");
const user_module_1 = require("./modules/user/user.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const auth_module_1 = require("./modules/auth/auth.module");
const config_1 = require("@nestjs/config");
const house_hold_module_1 = require("./modules/house-hold/house-hold.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, user_module_1.UserModule, auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({ isGlobal: true, }),
            house_hold_module_1.HouseHoldModule,
            admin_module_1.AdminModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map