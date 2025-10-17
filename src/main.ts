import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {AllExceptionsFilter} from "./common/filters/all-exceptions.filter";
import {ResponseInterceptor} from "./common/interceptors/response.interceptor";
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableCors({
    origin: 'http://localhost:3030',
    credentials: true,
  });
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.use(cookieParser()); // Đọc cookie
  app.useGlobalFilters(new AllExceptionsFilter())
  // Bật global validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,              // loại bỏ các field không có trong DTO
    forbidNonWhitelisted: true,   // lỗi nếu có field lạ
    transform: true,              // tự động chuyển đổi payload sang class
  }));

  await app.listen(process.env.PORT ?? 3030);
  console.log(`Server running on http://localhost:${process.env.PORT}`);
}
bootstrap();
