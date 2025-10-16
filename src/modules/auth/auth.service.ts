import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  async signup(dto: SignUpDto) {
    const exist = await this.prisma.users.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (exist) throw new ConflictException('Email or username already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: { ...dto, password: hashed, role: Role.USER },
    });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      this.configService.get<string>('JWT_SECRET')!,
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      this.configService.get<string>('JWT_REFRESH_SECRET')!,
      {
        expiresIn: '1d',
      }
    );

    return { user, accessToken, refreshToken };
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Your email is not exist');

    const match: Boolean = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Wrong password');

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      this.configService.get<string>('JWT_SECRET')!,
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      this.configService.get<string>('JWT_REFRESH_SECRET')!,
      {
        expiresIn: '1d',
      }
    );

    return { user, accessToken, refreshToken };
  }

  async refresh(user2: {id: number; role: string}){
    const accessToken = jwt.sign(
      {id: user2.id, role: user2.role},
      this.configService.get<string>('JWT_SECRET')!,
      { expiresIn: '15m' }
    )

    const user = await this.prisma.users.findUniqueOrThrow({
      where: { id: user2.id },
    });

    return { user, accessToken };
  }
}
