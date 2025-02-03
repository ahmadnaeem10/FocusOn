import { CustomException } from './custom.exception';
import { IError } from './interface';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyExistException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);

    Object.setPrototypeOf(this, UserAlreadyExistException.prototype);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
    };
  }
}
