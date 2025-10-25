import { UserService } from './user.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
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
