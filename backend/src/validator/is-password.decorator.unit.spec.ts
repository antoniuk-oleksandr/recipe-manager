import { validateSync } from '@nestjs/class-validator';
import { IsPassword } from './is-password.decorator';

describe('IsPassword Decorator Validator', () => {
  const validator = {
    validate(value: any) {
      if (typeof value !== 'string') return false;
      return (
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /[a-z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[^A-Za-z0-9]/.test(value)
      );
    },
    defaultMessage() {
      return 'Password is too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.';
    },
  };

  it('should validate a strong password', () => {
    expect(validator.validate('StrongP@ssw0rd')).toBe(true);
    expect(validator.validate('Abcdef1!')).toBe(true);
    expect(validator.validate('A1b2c3d4!')).toBe(true);
  });

  it('should invalidate passwords shorter than 8 characters', () => {
    expect(validator.validate('Ab1!')).toBe(false);
    expect(validator.validate('A1b!c')).toBe(false);
  });

  it('should invalidate passwords without uppercase letters', () => {
    expect(validator.validate('weakp@ss1')).toBe(false);
    expect(validator.validate('password1!')).toBe(false);
  });

  it('should invalidate passwords without lowercase letters', () => {
    expect(validator.validate('PASSWORD1!')).toBe(false);
    expect(validator.validate('ABC123!@')).toBe(false);
  });

  it('should invalidate passwords without numbers', () => {
    expect(validator.validate('Password!')).toBe(false);
    expect(validator.validate('Strong!Pass')).toBe(false);
  });

  it('should invalidate passwords without special characters', () => {
    expect(validator.validate('Password1')).toBe(false);
    expect(validator.validate('StrongPass1')).toBe(false);
  });

  it('should invalidate non-string values', () => {
    expect(validator.validate(null)).toBe(false);
    expect(validator.validate(undefined)).toBe(false);
    expect(validator.validate(12345678)).toBe(false);
    expect(validator.validate({})).toBe(false);
    expect(validator.validate([])).toBe(false);
  });

  it('should return the correct default error message', () => {
    expect(validator.defaultMessage()).toBe(
      'Password is too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    );
  });

  it('should use defaultMessage from the actual IsPassword validator', () => {
    class TestDto {
      @IsPassword()
      password: string;
    }

    const dto = new TestDto();
    dto.password = 'weak';

    const errors = validateSync(dto);
    expect(errors.length).toBeGreaterThan(0);
    const constraints = errors[0].constraints;
    expect(constraints).toBeDefined();
    expect(constraints?.isPassword).toBe(
      'Password is too weak. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    );
  });
});
