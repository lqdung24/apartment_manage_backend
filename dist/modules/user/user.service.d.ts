import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        id: number;
    }[]>;
    findById(id: number): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        id: number;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, data: UpdateUserDto): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: number): import("@prisma/client").Prisma.Prisma__UsersClient<{
        username: string;
        email: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        id: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
