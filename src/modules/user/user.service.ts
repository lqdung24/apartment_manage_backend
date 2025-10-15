import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from "../../shared/prisma/prisma.service";
import {Role} from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.users.findFirst({
      where:{
        OR:[
          {username: data.username},
          {email: data.email}
        ]
      }
    })

    if(existingUser){
      if(existingUser.username === data.username)
        throw new ConflictException('Username already exist')
      if(existingUser.email === data.email)
        throw new ConflictException('Email already exits')
    }
    data.role = Role.USER;
    return this.prisma.users.create({ data });
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findById(id: number) {
    return this.prisma.users.findUniqueOrThrow({ where: { id } });
  }

  async updateById(id: number, data: UpdateUserDto) {
    const updatedUser = await this.prisma.users.findFirstOrThrow({where: { id } });
    if(data.email || data.username){
      const orConditions: Array<{ email?: string; username?: string }> = [];

      if (data.email) orConditions.push({ email: data.email });
      if (data.username) orConditions.push({ username: data.username });

      const conflictUser = await this.prisma.users.findFirst({
        where: {
          OR: orConditions,
          NOT: { id },
        },
      });
      if(conflictUser) throw new ConflictException("Email or username adreadly exist")
    }
    return this.prisma.users.update({where: {id}, data})
  }

  removeById(id: number) {
    this.prisma.users.findFirstOrThrow({where: {id}})
    return this.prisma.users.delete({where: {id}})
  }
}
