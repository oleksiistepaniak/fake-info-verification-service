import { HttpException } from '@nestjs/common';

export class ApiHelper {
  static apiCheck(value: unknown, message: string): asserts value {
    if (!value) throw new HttpException(message, 400);
  }
}
