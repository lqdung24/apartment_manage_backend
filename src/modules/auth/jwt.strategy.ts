import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {PrismaService} from "../../shared/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { id: number; role: string }) {
    // payload là dữ liệu đã giải mã từ JWT
    // có thể kiểm tra user tồn tại trong DB
    const user = await this.prisma.users.findUnique({ where: { id: payload.id } });
    if (!user) {
      throw new Error('Invalid token'); // sẽ bị catch bởi AuthGuard
    }
    return { id: user.id, role: user.role }; // gắn vào req.user
  }
}
