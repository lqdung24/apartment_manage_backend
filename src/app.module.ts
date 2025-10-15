import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import {UserModule} from "./modules/user/user.module";
import {LoggerMiddleware} from "./common/middleware/logger.middleware";
import {AuthModule} from "./modules/auth/auth.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
