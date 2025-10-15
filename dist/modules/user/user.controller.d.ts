import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(data: CreateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: number;
        createtime: Date;
    }>;
    findAll(): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: number;
        createtime: Date;
    }[]>;
    findById(id: number): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: number;
        createtime: Date;
    }>;
    updateById(id: number, data: UpdateUserDto): Promise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: number;
        createtime: Date;
    }>;
    removeById(id: number): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role | null;
        id: number;
        createtime: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
