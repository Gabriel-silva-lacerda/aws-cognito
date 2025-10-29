import { Component, OnDestroy, inject, signal, viewChild, computed } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { passwordStrengthValidator } from '@shared/validators/password-strength.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  imports: [DynamicFormComponent, LoadingComponent, RouterLink],
  host: {
    '(keydown.enter)': 'handleEnterKey()',
  },
})
export class ForgotPasswordPage implements OnDestroy {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);

  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected userEmail = signal<string | null>(null);
  protected codeSent = signal(false);

  protected canSubmit = computed(() =>
    this.loading() || this.dynamicFormRef()?.form?.invalid
  );

  protected resendTimer = signal(0);
  private timerInterval!: any;

  protected emailFields: iDynamicField[] = [
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      validators: [Validators.required, Validators.email],
      padding: '10px',
    },
  ];

  protected resetFields: iDynamicField[] = [
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
  ];

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  private startResendTimer(seconds: number = 60) {
    this.resendTimer.set(seconds);
    this.timerInterval = setInterval(() => {
      if (this.resendTimer() > 0) {
        this.resendTimer.set(this.resendTimer() - 1);
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  handleEnterKey(): void {
    if (!this.loading() && this.dynamicFormRef()?.form?.valid) {
      this.onSubmit();
    }
  }

  async onSubmit(): Promise<void> {
    const formValue = this.dynamicFormRef()?.form?.getRawValue();
    if (!this.dynamicFormRef()?.form?.valid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      if (!this.codeSent()) {
        const email = formValue.email;
        this.userEmail.set(email);

        await this.cognitoService.forgotPassword(email);
        this.toastService.success('Código enviado! Verifique seu e-mail.');
        this.codeSent.set(true);
        this.startResendTimer();
      } else {
        const { code, newPassword } = formValue;
        await this.cognitoService.confirmForgotPassword(this.userEmail()!, code, newPassword);
        this.toastService.success('Senha redefinida com sucesso!');
        this.router.navigateByUrl('/auth/signin');
      }
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao processar solicitação.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  async resendCode(): Promise<void> {
    if (!this.userEmail() || this.resendTimer() > 0) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.cognitoService.forgotPassword(this.userEmail()!);
      this.toastService.success('Código reenviado com sucesso!');
      this.startResendTimer();
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao reenviar código.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  get dynamicForm() {
    return this.dynamicFormRef();
  }
}
