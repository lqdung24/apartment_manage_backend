import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(data: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        householdId: number | null;
        state: import("@prisma/client").$Enums.State;
        id: number;
    }>;
    updateRole(id: number, dto: UpdateUserRoleDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        householdId: number | null;
        state: import("@prisma/client").$Enums.State;
        id: number;
    }>;
    createAccounts(num: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getAll(page?: number, limit?: number): Promise<{
        data: {
            items: {
                username: string;
                email: string;
                role: import("@prisma/client").$Enums.Role;
                state: import("@prisma/client").$Enums.State;
                HouseHolds: {
                    apartmentNumber: string;
                    head: {
                        fullname: string;
                    };
                } | null;
                id: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    deleteMany(ids: number[]): Promise<{
        deletedUsers: number;
    }>;
}
