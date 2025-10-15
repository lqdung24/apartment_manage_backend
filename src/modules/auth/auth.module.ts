import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { RefreshTokenStrategy } from './refresh-token.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, JwtStrategy, PrismaService, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
