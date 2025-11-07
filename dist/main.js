"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const swagger_1 = require("@nestjs/swagger");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const cookieParser = require('cookie-parser');
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    app.enableCors({
        origin: 'http://localhost:3030',
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.use(cookieParser());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Backend API for Next.js app')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server running on http://localhost:${process.env.PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map