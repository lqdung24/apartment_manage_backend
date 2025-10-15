import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import {UserModule} from "./modules/user/user.module";
import {LoggerMiddleware} from "./common/middleware/logger.middleware";
import {AuthModule} from "./modules/auth/auth.module";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, UserModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
