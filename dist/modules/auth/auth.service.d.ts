import { PrismaService } from '../../shared/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    signup(dto: SignUpDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            createtime: Date;
            id: number;
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
            createtime: Date;
            id: number;
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
            createtime: Date;
            id: number;
        };
        accessToken: string;
    }>;
}
