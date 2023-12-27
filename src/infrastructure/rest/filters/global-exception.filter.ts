import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter<Error> {
  public catch(exception: any, host: ArgumentsHost): Promise<Response> {
    if (typeof exception === 'string') {
      return this.handleStringException(exception, host);
    }

    if (exception instanceof HttpException) {
      return this.handleGatewayException(exception, host);
    }

    if (exception?.message && String(exception.message).toLowerCase().includes('timeout')) {
      return this.handleGatewayException(new HttpException(exception.message, HttpStatus.SERVICE_UNAVAILABLE), host);
    }

    const status =
      exception.status && typeof exception.status === 'number' ? exception.status : HttpStatus.INTERNAL_SERVER_ERROR;

    return this.handleGatewayException(new HttpException(exception.response, status), host);
  }

  private handleGatewayException(exception: HttpException, host: ArgumentsHost): Promise<Response> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
      return response.status(statusCode).json({
        code: statusCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // eslint-disable-next-line
    const exceptionResponse: any = exception.getResponse();

    return response.status(statusCode).json({
      code: statusCode,
      message: exceptionResponse.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleStringException(exception: string, host: ArgumentsHost): Promise<Response> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(statusCode).json({
      message: exception,
      code: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
