// api-gateway/src/filters/rpc-exception.filter.ts

import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // getError() returns the original error object thrown by the microservice
    const rpcError = exception.getError();

    // If the error is a string, we handle it as a generic bad request
    if (typeof rpcError === 'string') {
      return response.status(400).json({
        statusCode: 400,
        message: rpcError,
      });
    }

    // If the error is an object (like from a NestJS HttpException),
    // we use its properties to create the HTTP response.
    const status = rpcError['status'] || 500;
    const message = rpcError['message'] || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
    });

    // It's also possible to return an Observable with throwError
    // return throwError(() => exception.getError());
  }
}
