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
const node_crypto_1 = require("node:crypto");
const mail_service_1 = require("../../common/mail/mail.service");
let UserService = class UserService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
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
    async getUsers(page = 1, limit = 10, search) {
        const where = search && search.trim().length > 0
            ? {
                OR: [
                    {
                        email: {
                            contains: search,
                            mode: client_1.Prisma.QueryMode.insensitive,
                        },
                    },
                    {
                        HouseHolds: {
                            is: {
                                head: {
                                    fullname: {
                                        contains: search,
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                    },
                                },
                            },
                        },
                    },
                ],
            }
            : undefined;
        const total = await this.prisma.users.count({ where });
        const totalPages = Math.ceil(total / limit);
        const currentPage = Math.min(page, totalPages || 1);
        const skip = (currentPage - 1) * limit;
        const data = await this.prisma.users.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createtime: 'desc' },
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
        });
        return {
            data: {
                items: data,
                total,
                page: currentPage,
                limit,
                totalPages,
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
    async userDetails(id) {
        return this.prisma.users.findFirstOrThrow({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                state: true,
                createtime: true,
                HouseHolds: {
                    select: {
                        id: true,
                        houseHoldCode: true,
                        apartmentNumber: true,
                        buildingNumber: true,
                        street: true,
                        ward: true,
                        province: true,
                        status: true,
                        createtime: true,
                        informationStatus: true,
                        head: {
                            select: {
                                id: true,
                                fullname: true,
                                nationalId: true,
                            },
                        },
                        resident: {
                            select: {
                                id: true,
                                fullname: true,
                                nationalId: true,
                                phoneNumber: true,
                                email: true,
                                dateOfBirth: true,
                                gender: true,
                                relationshipToHead: true,
                                residentStatus: true,
                                informationStatus: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async resetPassword(id) {
        const resetToken = (0, node_crypto_1.randomBytes)(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
        const user = await this.prisma.users.update({
            where: { id },
            data: { resetToken, resetTokenExpiry },
        });
        const resetLink = `http://localhost:3030/auth/reset-password?token=${resetToken}`;
        return await this.mailService.sendMail(user.email, 'Reset your password', `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`);
    }
    async getDetailsHouseholdChange(householdId) {
        return this.prisma.householdChanges.findFirstOrThrow({
            where: { householdId: householdId, informationStatus: client_1.InformationStatus.PENDING }
        });
    }
    async approveHouseholdChange(userId, id, state, reason) {
        if (state in [client_1.InformationStatus.APPROVED, client_1.InformationStatus.REJECTED]) {
            throw new common_1.BadRequestException('Invalid approve state');
        }
        if (state === client_1.InformationStatus.REJECTED && !reason) {
            throw new common_1.BadRequestException('Reject reason is required');
        }
        return this.prisma.$transaction(async (tx) => {
            const change = await tx.householdChanges.update({
                where: { id },
                data: {
                    reviewAdminId: userId,
                    reviewAt: new Date(),
                    informationStatus: state,
                    rejectReason: reason,
                },
            });
            await tx.houseHolds.update({
                where: { id: change.householdId },
                data: {
                    informationStatus: state,
                },
            });
            return change;
        });
    }
    async getDetailsResidentChanges(residentId) {
        return this.prisma.residentChanges.findFirstOrThrow({
            where: {
                residentId,
                informationStatus: {
                    in: [
                        client_1.InformationStatus.PENDING,
                    ],
                },
            },
        });
    }
    async approveResidentChange(userId, id, state, reason) {
        if (state === client_1.InformationStatus.REJECTED && !reason) {
            throw new common_1.BadRequestException('Reject reason is required');
        }
        return this.prisma.$transaction(async (tx) => {
            const change = await tx.residentChanges.update({
                where: { id },
                data: {
                    reviewAdminId: userId,
                    reviewAt: new Date(),
                    informationStatus: state,
                    rejectReason: reason,
                },
            });
            const updateData = {
                informationStatus: state,
                ...(change.action === client_1.Actions.DELETE && {
                    residentStatus: client_1.ResidenceStatus.MOVE_OUT,
                }),
            };
            await tx.resident.update({
                where: { id: change.residentId },
                data: {
                    ...updateData
                },
            });
            return change;
        });
    }
    async getSetting(userId) {
        return this.prisma.users.findFirstOrThrow({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
            }
        });
    }
    async updateAccount(userId, dto) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email) {
            const emailExists = await this.prisma.users.findFirst({
                where: {
                    email: dto.email,
                    NOT: { id: userId },
                },
            });
            if (emailExists) {
                throw new common_1.BadRequestException('Email already exists');
            }
        }
        if (dto.username) {
            const usernameExists = await this.prisma.users.findFirst({
                where: {
                    username: dto.username,
                    NOT: { id: userId },
                },
            });
            if (usernameExists) {
                throw new common_1.BadRequestException('Username already exists');
            }
        }
        const updateData = {};
        if (dto.email)
            updateData.email = dto.email;
        if (dto.username)
            updateData.username = dto.username;
        if (dto.newPassword || dto.oldPassword) {
            if (!dto.oldPassword || !dto.newPassword) {
                throw new common_1.BadRequestException('Old password and new password are required');
            }
            const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
            if (!isMatch) {
                throw new common_1.BadRequestException('Old password is incorrect');
            }
            const isSame = await bcrypt.compare(dto.newPassword, user.password);
            if (isSame) {
                throw new common_1.BadRequestException('New password must be different from old password');
            }
            updateData.password = await bcrypt.hash(dto.newPassword, 10);
        }
        return this.prisma.users.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                username: true,
            },
        });
    }
    async deleteAccount(userId) {
        const record = await this.prisma.users.update({
            where: { id: userId },
            data: { state: client_1.State.DELETED }
        });
        if (record.householdId) {
            await this.prisma.houseHolds.update({
                where: { id: record.householdId },
                data: { status: client_1.HouseHoldStatus.DELETE }
            });
        }
        return record;
    }
    async setRole(userId, role) {
        const updateData = { role };
        if (role !== client_1.Role.USER) {
            updateData.state = client_1.State.ACTIVE;
        }
        return this.prisma.users.update({
            where: { id: userId },
            data: updateData,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], UserService);
//# sourceMappingURL=user.service.js.map