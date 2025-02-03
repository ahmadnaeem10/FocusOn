import { HttpException } from '@nestjs/common';
import { IError } from './interface';

export abstract class CustomException extends HttpException {
  protected constructor(protected errorMessage: string, status: number) {
    super(errorMessage, status);
    Object.setPrototypeOf(this, CustomException.prototype);
  }

  abstract serializeErrors(): IError;
}
