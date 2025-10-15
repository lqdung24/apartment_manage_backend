import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import {UserModule} from "./modules/user/user.module";
import {LoggerMiddleware} from "./shared/middleware/logger.middleware";

@Module({
  imports: [PrismaModule, UserModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
