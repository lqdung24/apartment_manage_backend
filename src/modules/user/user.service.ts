import {BadRequestException, ConflictException, Injectable, NotFoundException, Patch} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import {Actions, HouseHoldStatus, InformationStatus, Prisma, ResidenceStatus, Role, State} from "@prisma/client";
import {UpdateUserRoleDto} from "./dto/update-user-role.dto";
import * as bcrypt from 'bcrypt';
import {randomBytes} from "node:crypto";
import {MailService} from "../../common/mail/mail.service";
import now = jest.now;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,
              private mailService: MailService) {}

  async createUser(dto: CreateUserDto){
    return this.prisma.users.create({
      data:{
        ...dto
      }
    })
  }
  async updateHouseholdId(id: number, householdId: number){
    return this.prisma.users.update({
      where: {id},
      data: {householdId}
    })
  }
  async updateRole(id: number, dto: UpdateUserRoleDto){
    return this.prisma.users.update({
      where: { id },
      data: {role: dto.role}
    })
  }
  async create(dto:CreateUserDto){
    return this.prisma.users.create({
      data: dto
    })
  }

  async createAccounts(num: number) {
    if (num <= 0) {
      throw new Error('num must be > 0');
    }

    const suffix = Date.now(); // đảm bảo không trùng
    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = Array.from({ length: num }).map((_, i) => ({
      username: `user_${suffix}_${i}`,
      email: `user_${suffix}_${i}@sunrise.local`,
      password: hashedPassword,
      role: Role.USER,
    }));

    return this.prisma.users.createMany({
      data: users,
    });
  }


  async getUsers(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.UsersWhereInput | undefined =
      search && search.trim().length > 0
        ? {
          OR: [
            {
              email: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              HouseHolds: {
                is: {
                  head: {
                    fullname: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
            },
          ],
        }
        : undefined;


    const [data, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createtime: 'desc',
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          state: true,
          HouseHolds: {
            select: {
              apartmentNumber: true,
              head: {
                select: {
                  fullname: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.users.count({ where }),
    ]);

    return {
      data: {
        items: data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


async deleteUsers(ids: number[]) {
    return this.prisma.$transaction(async (tx) => {
      // soft delete households liên quan
      await tx.houseHolds.updateMany({
        where: {
          userID: {
            in: ids,
          },
        },
        data: {
          status: HouseHoldStatus.DELETE,
        },
      });

      // soft delete users
      const result = await tx.users.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          state: State.DELETED,
        },
      });

      return {
        deletedUsers: result.count,
      };
    });
  }
  async userDetails(id: number) {
    return this.prisma.users.findFirstOrThrow({
      where: {
        id,
        state: {
          not: State.DELETED,
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        state: true,
        createtime: true,

        HouseHolds: {
          select: {
            id: true,
            houseHoldCode: true,
            apartmentNumber: true,
            buildingNumber: true,
            street: true,
            ward: true,
            province: true,
            status: true,
            createtime: true,
            informationStatus: true,

            // Chủ hộ
            head: {
              select: {
                id: true,
                fullname: true,
                nationalId: true,
              },
            },

            // ✅ Thành viên trong hộ gia đình
            resident: {
              select: {
                id: true,
                fullname: true,
                nationalId: true,
                phoneNumber: true,
                email: true,
                dateOfBirth: true,
                gender: true,
                relationshipToHead: true,
                residentStatus: true,
                informationStatus: true,
              },
            },
          },
        },
      },
    });
  }
  async resetPassword(id: number) {
    // Tạo token reset
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 giờ

    const user =await this.prisma.users.update({
      where: { id },
      data: { resetToken, resetTokenExpiry },
    });

    // link đến front end
    const resetLink = `http://localhost:3030/auth/reset-password?token=${resetToken}`;

    return await this.mailService.sendMail(
      user.email,
      'Reset your password',
      `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    );
  }
  async getDetailsHouseholdChange(householdId: number){
    return this.prisma.householdChanges.findFirstOrThrow({
      where: {householdId: householdId, informationStatus: InformationStatus.PENDING}
    })
  }

  async approveHouseholdChange(
    userId: number,
    id: number,
    state: InformationStatus,
    reason?: string
  ) {
    if (
      state in [InformationStatus.APPROVED, InformationStatus.REJECTED]
    ) {
      throw new BadRequestException('Invalid approve state');
    }

    if (state === InformationStatus.REJECTED && !reason) {
      throw new BadRequestException('Reject reason is required');
    }

    return this.prisma.$transaction(async (tx) => {
      // update change
      const change = await tx.householdChanges.update({
        where: { id },
        data: {
          reviewAdminId: userId,
          reviewAt: new Date(),
          informationStatus: state,
          rejectReason: reason,
        },
      });

      // update household
      await tx.houseHolds.update({
        where: { id: change.householdId },
        data: {
          informationStatus: state,
        },
      });

      return change;
    });
  }

  async getDetailsResidentChanges(residentId: number) {
    return this.prisma.residentChanges.findFirstOrThrow({
      where: {
        residentId,
        informationStatus: {
          in: [
            InformationStatus.PENDING,
          ],
        },
      },
    });
  }

  async approveResidentChange(
    userId: number,
    id: number,
    state: InformationStatus,
    reason?: string
  ) {
    // reject thì bắt buộc có lý do
    if (state === InformationStatus.REJECTED && !reason) {
      throw new BadRequestException('Reject reason is required');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. update resident change
      const change = await tx.residentChanges.update({
        where: { id },
        data: {
          reviewAdminId: userId,
          reviewAt: new Date(),
          informationStatus: state,
          rejectReason: reason,
        },
      });

      const updateData = {
        informationStatus: state,
        ...(change.action === Actions.DELETE && {
          residentStatus: ResidenceStatus.MOVE_OUT,
        }),
      };


      // 2. update resident
      await tx.resident.update({
        where: { id: change.residentId },
        data: {
          ...updateData
        },
      });

      return change;
    });
  }

}
