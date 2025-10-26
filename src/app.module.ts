import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import {UserModule} from "./modules/user/user.module";
import {LoggerMiddleware} from "./common/middleware/logger.middleware";
import {AuthModule} from "./modules/auth/auth.module";
import { ConfigModule } from '@nestjs/config';
import {HouseHoldModule} from "./modules/house-hold/house-hold.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    HouseHoldModule,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
