import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEnglishAndAllowedChars', async: false })
export class IsEnglishAndAllowedCharsConstraint
  implements ValidatorConstraintInterface
{
  validate(text: string): boolean {
    if (typeof text !== 'string') {
      return false;
    }

    const allowedRegex = /^[a-zA-Z0-9\s.,?!'"@#$%^&*()_+=\-\/\\:;<>]*$/;

    return allowedRegex.test(text);
  }

  defaultMessage(): string {
    return 'message_should_be_english_and_allowed_chars';
  }
}

export function IsEnglishAndAllowedChars(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEnglishAndAllowedCharsConstraint,
    });
  };
}
