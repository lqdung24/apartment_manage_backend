import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignUpDto, res: Response): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            createtime: Date;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            householdId: number | null;
            id: number;
        };
        accessToken: string;
    }>;
    signin(dto: SignInDto, res: Response): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            createtime: Date;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            householdId: number | null;
            id: number;
        };
        accessToken: string;
    }>;
    refresh(req: any): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            createtime: Date;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            householdId: number | null;
            id: number;
        };
        accessToken: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    verifyResetToken(token: string): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
