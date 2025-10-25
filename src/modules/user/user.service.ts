import {ConflictException, Injectable, NotFoundException, Patch} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import {Role} from "@prisma/client";
import {UpdateUserRoleDto} from "./dto/update-user-role.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
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
}
