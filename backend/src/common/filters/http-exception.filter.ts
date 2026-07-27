import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse();

        const request = ctx.getRequest();

        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse();

        let message = 'Unexpected error';

        if(typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }
        else if(typeof exceptionResponse === 'object') {
            message = (exceptionResponse as any).message ?? message;
        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}