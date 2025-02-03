import { CustomException } from './custom.exception';
import { IError } from './interface';
import { HttpStatus } from '@nestjs/common';

export class BadRequestException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
    };
  }
}
