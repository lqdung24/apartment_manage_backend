"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(dto) {
        return this.prisma.users.create({
            data: {
                ...dto
            }
        });
    }
    async updateHouseholdId(id, householdId) {
        return this.prisma.users.update({
            where: { id },
            data: { householdId }
        });
    }
    async updateRole(id, dto) {
        return this.prisma.users.update({
            where: { id },
            data: { role: dto.role }
        });
    }
    async create(dto) {
        return this.prisma.users.create({
            data: dto
        });
    }
    async createAccounts(num) {
        if (num <= 0) {
            throw new Error('num must be > 0');
        }
        const suffix = Date.now();
        const hashedPassword = await bcrypt.hash('123456', 10);
        const users = Array.from({ length: num }).map((_, i) => ({
            username: `user_${suffix}_${i}`,
            email: `user_${suffix}_${i}@sunrise.local`,
            password: hashedPassword,
            role: client_1.Role.USER,
        }));
        return this.prisma.users.createMany({
            data: users,
        });
    }
    async getAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.prisma.$transaction([
            this.prisma.users.findMany({
                skip,
                take: limit,
                orderBy: {
                    createtime: 'desc',
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                    state: true,
                    HouseHolds: {
                        select: {
                            apartmentNumber: true,
                            head: {
                                select: {
                                    fullname: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.users.count(),
        ]);
        return {
            data: {
                items: data,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async deleteUsers(ids) {
        return this.prisma.$transaction(async (tx) => {
            await tx.houseHolds.updateMany({
                where: {
                    userID: {
                        in: ids,
                    },
                },
                data: {
                    status: client_1.HouseHoldStatus.DELETE,
                },
            });
            const result = await tx.users.updateMany({
                where: {
                    id: {
                        in: ids,
                    },
                },
                data: {
                    state: client_1.State.DELETED,
                },
            });
            return {
                deletedUsers: result.count,
            };
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map