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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const node_crypto_1 = require("node:crypto");
const mail_service_1 = require("../../common/mail/mail.service");
let AuthService = class AuthService {
    prisma;
    configService;
    mailService;
    constructor(prisma, configService, mailService) {
        this.prisma = prisma;
        this.configService = configService;
        this.mailService = mailService;
    }
    async signup(dto) {
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.users.create({
            data: { ...dto, password: hashed, role: client_1.Role.USER },
        });
        const accessToken = jwt.sign({ id: user.id, role: user.role }, this.configService.get('JWT_SECRET'), {
            expiresIn: '3d',
        });
        const refreshToken = jwt.sign({ id: user.id }, this.configService.get('JWT_REFRESH_SECRET'), {
            expiresIn: '7d',
        });
        return { user, accessToken, refreshToken };
    }
    async signin(dto) {
        const user = await this.prisma.users.findUniqueOrThrow({
            where: { email: dto.email },
        });
        const match = await bcrypt.compare(dto.password, user.password);
        if (!match)
            throw new common_1.UnauthorizedException('Wrong password');
        const accessToken = jwt.sign({ id: user.id, role: user.role }, this.configService.get('JWT_SECRET'), {
            expiresIn: '3d',
        });
        const refreshToken = jwt.sign({ id: user.id }, this.configService.get('JWT_REFRESH_SECRET'), {
            expiresIn: '7d',
        });
        return { user, accessToken, refreshToken };
    }
    async refresh(user2) {
        const accessToken = jwt.sign({ id: user2.id, role: user2.role }, this.configService.get('JWT_SECRET'), { expiresIn: '3d' });
        const user = await this.prisma.users.findUniqueOrThrow({
            where: { id: user2.id },
        });
        return { user, accessToken };
    }
    async forgotPassword(email) {
        const user = await this.prisma.users.findUnique({ where: { email } });
        const message = { message: 'If this email exists, a reset link has been sent' };
        if (!user)
            return message;
        const resetToken = (0, node_crypto_1.randomBytes)(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);
        await this.prisma.users.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });
        const resetLink = `http://localhost:3030/auth/reset-password?token=${resetToken}`;
        await this.mailService.sendMail(email, 'Reset your password', `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`);
        return message;
    }
    async verifyResetToken(token) {
        const user = await this.prisma.users.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
        if (!user)
            throw new Error('Invalid or expired token');
        return { message: 'Valid token' };
    }
    async resetPassword(token, newPassword) {
        const user = await this.prisma.users.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
        if (!user)
            throw new Error('Invalid or expired token');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.users.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
        });
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map