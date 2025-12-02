import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createUser(dto: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createtime: Date;
        householdId: number | null;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        id: number;
    }>;
    updateHouseholdId(id: number, householdId: number): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createtime: Date;
        householdId: number | null;
        id: number;
    }>;
    updateRole(id: number, dto: UpdateUserRoleDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        id: number;
        householdId: number | null;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    }>;
    create(dto: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        id: number;
        householdId: number | null;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        householdId: number | null;
        id: number;
    }>;
}
