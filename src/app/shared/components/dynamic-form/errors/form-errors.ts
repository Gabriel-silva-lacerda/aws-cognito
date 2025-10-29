import { InjectionToken } from '@angular/core';

export interface ErrorMessages {
  [key: string]: (params: unknown) => string;
}

export const DEFAULT_ERRORS = {
  required: () => `Campo obrigatório`,
  email: () => `E-mail inválido`,
  minlength: ({ requiredLength }: { requiredLength: number }) => `Mínimo de ${requiredLength} caracteres`,
  maxlength: ({ requiredLength }: { requiredLength: number }) => `Máximo de ${requiredLength} caracteres`,
  min: ({ min }: { min: number }) => `Valor mínimo: ${min}`,
  max: ({ max }: { max: number }) => `Valor máximo: ${max}`,
  mask: () => `Valor inválido`,
  passwordNotMatch: () => `As senhas não coincidem`,
  fullName: () => `Sobrenome obrigatório`,
  invalidDate: () => `Data inválida`,
  invalidTime: () => `Horário inválido`,
  invalidTimeOrder: () => `O horário final deve ser maior que o inicial`,
  passwordStrength: (params: any) => {
    if (!params) return 'Senha inválida';
    const missing: string[] = [];

    if (!params.hasUpperCase) missing.push('1 letra maiúscula');
    if (!params.hasLowerCase) missing.push('1 letra minúscula');
    if (!params.hasNumber) missing.push('1 número');
    if (!params.hasSpecialChar) missing.push('1 caractere especial');

    return `A senha deve conter pelo menos ${missing.join(', ')}.`;
  },
};

export const ERROR_MESSAGES = new InjectionToken('ERROR_MESSAGES', {
  providedIn: 'root',
  factory: () => DEFAULT_ERRORS,
});
