import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from '@nestjs/class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: string,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          validationArguments?: ValidationArguments,
        ): boolean {
          const checks = [
            typeof value === 'string',
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /[0-9]/.test(value),
            /[^A-Za-z0-9]/.test(value),
          ];
          return checks.every(Boolean);
        },
        defaultMessage(): string {
          return 'Password is too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.';
        },
      },
    });
  };
}
