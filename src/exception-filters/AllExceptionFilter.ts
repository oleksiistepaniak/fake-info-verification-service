import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: HttpStatus;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        status = exceptionResponse['statusCode'] || status;

        const rawMessage = exceptionResponse['message'];
        if (Array.isArray(rawMessage)) {
          message = rawMessage[rawMessage.length - 1];
        } else {
          message = rawMessage || 'unknown_error';
        }
      } else {
        message = String(exceptionResponse);
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'internal_server_error';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'internal_server_error';
    }

    const responseBody = {
      message: message,
      statusCode: status,
    };

    response.status(status).json(responseBody);
  }
}
