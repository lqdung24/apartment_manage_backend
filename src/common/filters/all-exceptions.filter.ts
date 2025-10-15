import {Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus,} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch() // bắt mọi exception
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // NestJS built-in exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') message = res;
      else if (typeof res === 'object' && (res as any).message)
        message = (res as any).message;
    }

    // Prisma known request errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Mã lỗi Prisma: https://www.prisma.io/docs/reference/api-reference/error-reference
      switch (exception.code) {
        case 'P2002': // unique constraint failed
          status = HttpStatus.CONFLICT;
          const fields = (exception.meta?.target as string[])?.join(', ') || 'unknown';
          message = `Duplicate value for field(s): ${fields}`;
          break;
        case 'P2025': // record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = exception.message;
          break;
      }
    }

    // Prisma unknown errors (chưa map)
    else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown database error';
    }

    // Lỗi JS thông thường
    else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // Trả về JSON chuẩn
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
