/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DefaultExceptionFilter } from './default-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

describe('DefaultExceptionFilter', () => {
  let filter: DefaultExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new DefaultExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockRequest = {
      url: '/test/path',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ArgumentsHost;
  });

  it('should handle HttpException with string response', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      error: 'NOT_FOUND',
      message: 'Not Found',
      path: '/test/path',
    });
  });

  it('should handle HttpException with object response containing message array', () => {
    const responseObj = { message: ['Error 1', 'Error 2'] };
    const exception = new HttpException(responseObj, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'BAD_REQUEST',
      message: 'Error 1, Error 2',
      path: '/test/path',
    });
  });

  it('should handle HttpException with object response containing message string', () => {
    const responseObj = { message: 'Single error' };
    const exception = new HttpException(responseObj, HttpStatus.FORBIDDEN);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      error: 'FORBIDDEN',
      message: 'Single error',
      path: '/test/path',
    });
  });

  it('should handle HttpException with object response without message', () => {
    const responseObj = { error: 'Something went wrong' };
    const exception = new HttpException(responseObj, HttpStatus.UNAUTHORIZED);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: 'UNAUTHORIZED',
      message: exception.message,
      path: '/test/path',
    });
  });

  it('should handle generic error (non-HttpException)', () => {
    const exception = new Error('Unexpected failure');
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL',
      message: 'Unexpected failure',
      path: '/test/path',
    });

    expect(consoleSpy).toHaveBeenCalledWith(exception);
    consoleSpy.mockRestore();
  });

  it('should handle generic error with no message', () => {
    const exception = {};

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL',
      message: 'Internal server error',
      path: '/test/path',
    });
  });

  it('should handle HttpException with unknown status code and set error type to UNKNOWN', () => {
    const customStatus = 599;
    const exception = new HttpException('Custom Error', customStatus);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(customStatus);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: customStatus,
      error: 'UNKNOWN',
      message: 'Custom Error',
      path: '/test/path',
    });
  });
});
