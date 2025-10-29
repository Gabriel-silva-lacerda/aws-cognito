import { Component, OnDestroy, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { AUTH_FIELDS } from '../../constants/auth.fields';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  imports: [DynamicFormComponent, LoadingComponent, RouterLink],
  host: {
    '(keydown.enter)': 'handleEnterKey()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage implements OnDestroy {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);
  private timerInterval!: any;

  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected userEmail = signal<string | null>(null);
  protected codeSent = signal(false);

  protected resendTimer = signal(0);
  protected emailFields: iDynamicField[] = AUTH_FIELDS().FORGOT_PASSWORD.EMAIL;
  protected resetFields: iDynamicField[] = AUTH_FIELDS().FORGOT_PASSWORD.RESET;

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

  protected handleEnterKey(): void {
    if (!this.loading() && this.dynamicFormRef()?.form?.valid) {
      this.onSubmit();
    }
  }

  protected async onSubmit(): Promise<void> {
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

  protected async resendCode(): Promise<void> {
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

  protected get dynamicForm() {
    return this.dynamicFormRef();
  }
}
