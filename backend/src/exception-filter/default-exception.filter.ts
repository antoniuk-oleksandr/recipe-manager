/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status: number;
    let message: string;
    let errorType: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      if (typeof responseData === 'string') {
        message = responseData;
      } else if (typeof responseData === 'object' && responseData['message']) {
        message = Array.isArray(responseData['message'])
          ? responseData['message'].join(', ')
          : responseData['message'];
      } else {
        message = exception.message;
      }
      errorType =
        HttpStatus[status]?.toUpperCase().replace(/ /g, '_') || 'UNKNOWN';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception?.message || 'Internal server error';
      errorType = 'INTERNAL';
      console.error(exception);
    }

    response.status(status).send({
      statusCode: status,
      error: errorType,
      message,
      path: request.url,
    });
  }
}
