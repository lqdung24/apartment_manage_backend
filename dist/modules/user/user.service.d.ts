import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import { InformationStatus, Prisma } from "@prisma/client";
import { UpdateUserRoleDto } from "./dto/update-user-role.dto";
import { MailService } from "../../common/mail/mail.service";
export declare class UserService {
    private readonly prisma;
    private mailService;
    constructor(prisma: PrismaService, mailService: MailService);
    createUser(dto: CreateUserDto): Promise<{
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
    updateHouseholdId(id: number, householdId: number): Promise<{
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
    create(dto: CreateUserDto): Promise<{
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
    createAccounts(num: number): Promise<Prisma.BatchPayload>;
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
    deleteUsers(ids: number[]): Promise<{
        deletedUsers: number;
    }>;
    userDetails(id: number): Promise<{
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
    resetPassword(id: number): Promise<any>;
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
    approveHouseholdChange(userId: number, id: number, state: InformationStatus, reason?: string): Promise<{
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
    getDetailsResidentChanges(residentId: number): Promise<{
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
    approveResidentChange(userId: number, id: number, state: InformationStatus, reason?: string): Promise<{
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
