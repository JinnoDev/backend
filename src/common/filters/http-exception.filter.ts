import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Filtro global de errores HTTP.
 * Devuelve siempre el mismo formato JSON para todos los errores:
 * {
 *   statusCode: 404,
 *   message: "No encontrado",
 *   error: "Not Found",
 *   timestamp: "2026-01-01T00:00:00Z",
 *   path: "/api/v1/users/123"
 * }
 *
 * Para registrarlo globalmente, en main.ts agrega:
 *   app.useGlobalFilters(new HttpExceptionFilter());
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx    = host.switchToHttp();
    const res    = ctx.getResponse<Response>();
    const req    = ctx.getRequest();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object' && 'message' in (exceptionResponse as object)
        ? (exceptionResponse as any).message
        : exception.message;

    res.status(status).json({
      statusCode: status,
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
