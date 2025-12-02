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
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        createtime: Date;
        householdId: number | null;
        createtime: Date;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        id: number;
    }>;
    updateRole(id: number, dto: UpdateUserRoleDto): Promise<{
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
}
