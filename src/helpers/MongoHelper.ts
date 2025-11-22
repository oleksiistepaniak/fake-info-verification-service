import { isObjectNotNull } from './helpers';

export enum MongoErrors {
  DUPLICATED_KEY = 11000,
}

export class MongoHelper {
  static isUniqueError<T>(error: unknown, fieldName?: keyof T): boolean {
    if (!isObjectNotNull(error)) return false;

    const code = error.code;
    if (code !== MongoErrors.DUPLICATED_KEY) return false;

    const keyValue = error.keyValue;
    if (!isObjectNotNull(keyValue)) return false;

    return fieldName ? Boolean(keyValue[fieldName]) : true;
  }
}
