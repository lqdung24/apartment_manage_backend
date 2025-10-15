import { PrismaService } from "../../shared/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            createtime: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            username: string;
            email: string;
            password: string;
            role: import("@prisma/client").$Enums.Role;
            id: number;
            createtime: Date;
        };
        token: string;
    }>;
}
