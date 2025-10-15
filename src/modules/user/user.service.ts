import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from "../../shared/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateUserDto) {
    return this.prisma.users.create({data});
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findById(id: number) {
    return this.prisma.users.findUnique({where: {id}})
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.users.update({where: {id}, data})
  }

  remove(id: number) {
    return this.prisma.users.delete({where: {id}})
  }
}
