import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {PrismaService} from "../../shared/prisma/prisma.service";
import {RegisterDto} from "./dto/register.dto";
import {Role} from "@prisma/client";
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const exist = await this.prisma.users.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (exist) throw new ConflictException('Email or username already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: { ...dto, password: hashed, role: Role.USER },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { user, token };
  }
}
