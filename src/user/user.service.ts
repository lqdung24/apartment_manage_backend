import { Injectable } from '@nestjs/common';
import {PrismaService} from "../database/database.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}
  create(createUserDto: Prisma.UsersCreateArgs) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
