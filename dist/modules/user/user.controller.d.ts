import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApproveHouseholdChangeDto } from "./ApproveHouseholdChange";
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
    getUsers(page?: number, limit?: number, search?: string): Promise<{
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
    getDetails(id: number): Promise<{
        username: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createtime: Date;
        state: import("@prisma/client").$Enums.State;
        HouseHolds: {
            resident: {
                email: string;
                id: number;
                informationStatus: import("@prisma/client").$Enums.InformationStatus;
                nationalId: string;
                phoneNumber: string;
                fullname: string;
                dateOfBirth: Date;
                gender: import("@prisma/client").$Enums.Gender;
                relationshipToHead: import("@prisma/client").$Enums.RelationshipToHead;
                residentStatus: import("@prisma/client").$Enums.ResidenceStatus;
            }[];
            createtime: Date;
            id: number;
            houseHoldCode: number;
            apartmentNumber: string;
            buildingNumber: string;
            street: string;
            ward: string;
            province: string;
            status: import("@prisma/client").$Enums.HouseHoldStatus;
            informationStatus: import("@prisma/client").$Enums.InformationStatus;
            head: {
                id: number;
                nationalId: string;
                fullname: string;
            };
        } | null;
        id: number;
    }>;
    deleteMany(ids: number[]): Promise<{
        deletedUsers: number;
    }>;
    resetPassword(id: number): Promise<any>;
    approveHouseholdChange(id: number, body: ApproveHouseholdChangeDto, req: any): Promise<{
        householdId: number;
        id: number;
        informationStatus: import("@prisma/client").$Enums.InformationStatus;
        action: import("@prisma/client").$Enums.Actions;
        submitUserId: number;
        submitAt: Date;
        updateReason: string | null;
        reviewAdminId: number | null;
        reviewAt: Date | null;
        rejectReason: string | null;
    }>;
    getDetailsHouseholdChange(householdId: number): Promise<{
        householdId: number;
        id: number;
        informationStatus: import("@prisma/client").$Enums.InformationStatus;
        action: import("@prisma/client").$Enums.Actions;
        submitUserId: number;
        submitAt: Date;
        updateReason: string | null;
        reviewAdminId: number | null;
        reviewAt: Date | null;
        rejectReason: string | null;
    }>;
    getDetailsResidentChange(residentId: number): Promise<{
        id: number;
        informationStatus: import("@prisma/client").$Enums.InformationStatus;
        action: import("@prisma/client").$Enums.Actions;
        submitUserId: number;
        submitAt: Date;
        updateReason: string | null;
        reviewAdminId: number | null;
        reviewAt: Date | null;
        rejectReason: string | null;
        residentId: number;
    }>;
    approveResidentChange(id: number, body: ApproveHouseholdChangeDto, req: any): Promise<{
        id: number;
        informationStatus: import("@prisma/client").$Enums.InformationStatus;
        action: import("@prisma/client").$Enums.Actions;
        submitUserId: number;
        submitAt: Date;
        updateReason: string | null;
        reviewAdminId: number | null;
        reviewAt: Date | null;
        rejectReason: string | null;
        residentId: number;
    }>;
}
