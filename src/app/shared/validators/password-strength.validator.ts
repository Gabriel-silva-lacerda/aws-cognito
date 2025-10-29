import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&#.^(){}[\]<>;:'"|~_=+-]/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return !isValid
      ? {
          passwordStrength: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
          },
        }
      : null;
  };
}
