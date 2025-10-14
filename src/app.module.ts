import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { AdminController } from './admin/admin.controller';
import { UserModule } from './user/user.module';
import { PrismaModule } from './database/prisma.module';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [AppController, CatsController, AdminController],
  providers: [AppService],
  imports: [UserModule, PrismaModule, DatabaseModule],
})
export class AppModule {}
