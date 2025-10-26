import { PrismaService } from '../../shared/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from "../../common/mail/mail.service";
export declare class AuthService {
    private prisma;
    private configService;
    private mailService;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService);
    signup(dto: SignUpDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            householdId: number | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createtime: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    signin(dto: SignInDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            householdId: number | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createtime: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(user2: {
        id: number;
        role: string;
    }): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            householdId: number | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            createtime: Date;
        };
        accessToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
