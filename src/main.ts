import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,          // loại bỏ các field không có trong DTO
    forbidNonWhitelisted: true, // lỗi nếu có field lạ
    transform: true,           // tự động chuyển đổi payload sang class
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
