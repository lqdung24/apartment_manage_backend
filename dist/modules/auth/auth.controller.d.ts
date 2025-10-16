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
            id: number;
            createtime: Date;
        };
        accessToken: string;
    }>;
    signin(dto: SignInDto, res: Response): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            createtime: Date;
        };
        accessToken: string;
    }>;
    refresh(req: any): Promise<{
        accessToken: string;
    }>;
}
