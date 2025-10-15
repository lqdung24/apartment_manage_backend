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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingUser = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username === data.username)
                throw new common_1.ConflictException('Username already exist');
            if (existingUser.email === data.email)
                throw new common_1.ConflictException('Email already exits');
        }
        data.role = client_1.Role.USER;
        return this.prisma.users.create({ data });
    }
    async findAll() {
        return this.prisma.users.findMany();
    }
    async findById(id) {
        return this.prisma.users.findUniqueOrThrow({ where: { id } });
    }
    async updateById(id, data) {
        const updatedUser = await this.prisma.users.findFirstOrThrow({ where: { id } });
        if (data.email || data.username) {
            const orConditions = [];
            if (data.email)
                orConditions.push({ email: data.email });
            if (data.username)
                orConditions.push({ username: data.username });
            const conflictUser = await this.prisma.users.findFirst({
                where: {
                    OR: orConditions,
                    NOT: { id },
                },
            });
            if (conflictUser)
                throw new common_1.ConflictException("Email or username adreadly exist");
        }
        return this.prisma.users.update({ where: { id }, data });
    }
    removeById(id) {
        this.prisma.users.findFirstOrThrow({ where: { id } });
        return this.prisma.users.delete({ where: { id } });
    }
    async updateRole(id, dto) {
        const user = await this.prisma.users.findFirst({
            where: { id }
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.users.update({
            where: { id },
            data: { role: dto.role }
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map