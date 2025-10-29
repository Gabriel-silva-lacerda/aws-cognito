import { Validators } from "@angular/forms";
import { passwordStrengthValidator } from "@shared/validators/password-strength.validator";

export const AUTH_FIELDS = () => {
  return {
    SIGN_UP: [
      {
        name: 'name',
        label: 'Nome Completo',
        type: 'text',
        validators: [Validators.required],
        padding: '10px',
      },
      {
        name: 'email',
        label: 'E-mail',
        type: 'email',
        validators: [Validators.required, Validators.email],
        padding: '10px',
      },
      {
        name: 'password',
        label: 'Senha',
        type: 'password',
        validators: [
          Validators.required,
          Validators.minLength(8),
          passwordStrengthValidator()
        ],
        padding: '10px',
      },
    ],
    SIGN_IN: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validators: [Validators.required, Validators.email],
        padding: '10px',
      },
      {
        name: 'password',
        label: 'Senha',
        type: 'password',
        validators: [Validators.required],
        padding: '10px',
      },
    ],
    CONFIRM: [
      {
        name: 'code',
        label: 'Código de Confirmação',
        type: 'text',
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
        padding: '10px',
      },
    ],
    FORGOT_PASSWORD: {
      EMAIL: [
        {
          name: 'email',
          label: 'E-mail',
          type: 'email',
          validators: [Validators.required, Validators.email],
          padding: '10px',
        },
      ],
      RESET: [
        {
          name: 'code',
          label: 'Código de Verificação',
          type: 'text',
          validators: [Validators.required, Validators.minLength(6)],
          padding: '10px',
        },
        {
          name: 'newPassword',
          label: 'Nova Senha',
          type: 'password',
          validators: [
            Validators.required,
            Validators.minLength(8),
            passwordStrengthValidator()
          ],
          padding: '10px',
        },
      ]
    }
 };
}
