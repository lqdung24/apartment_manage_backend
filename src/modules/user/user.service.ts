import {ConflictException, Injectable, NotFoundException, Patch} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import {HouseHoldStatus, Role, State} from "@prisma/client";
import {UpdateUserRoleDto} from "./dto/update-user-role.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.users.findMany({
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
      this.prisma.users.count(),
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

}
