import { PrismaService } from "../../shared/prisma/prisma.service";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateHouseholdId(id: number, householdId: number): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        id: number;
        householdId: number | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createtime: Date;
    }>;
    updateRole(id: number, dto: UpdateUserRoleDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        id: number;
        householdId: number | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createtime: Date;
    }>;
}
