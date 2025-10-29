// confirm-code.page.ts
import { Component, inject, signal, ChangeDetectionStrategy, OnInit, viewChild, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ToastService } from '@shared/services/toast/toast.service';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
@Component({
  selector: 'app-confirm-code-page',
  templateUrl: './confirm-code.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    DynamicFormComponent,
    LoadingComponent,
  ],
})
export class ConfirmCodePage implements OnInit, OnDestroy {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected userEmail = signal<string | null>(null);

  protected resendTimer = signal(0);
  private timerInterval!: any;

  protected confirmFields: iDynamicField[] = [
    {
      name: 'code',
      label: 'Código de Confirmação',
      type: 'text',
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      padding: '10px',
    },
  ];

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('confirmEmail');
    const shouldResend = localStorage.getItem('resendOnConfirm') === 'true';

    if (storedEmail) {
      this.userEmail.set(storedEmail);

      if (shouldResend) {
        this.resendConfirmationEmail(true);
        localStorage.removeItem('resendOnConfirm');
        return;
      }

      this.startResendTimer();
      return;
    }

    this.router.navigateByUrl('/auth/signup');
  }


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

  async onSubmit(): Promise<void> {
    const formValue = this.dynamicFormRef()?.form?.getRawValue();
    if (!this.dynamicFormRef()?.form?.valid) return;
    if (!this.userEmail()) {
      this.error.set('E-mail do usuário não definido.');
      this.toastService.error(this.error()!);
      return;
    }

    const code = formValue.code;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.cognitoService.confirmSignUp(this.userEmail()!, code);
      this.toastService.success('Conta confirmada com sucesso!');
      localStorage.removeItem('confirmEmail');
      this.router.navigateByUrl('/auth/signin');

    } catch (err: any) {
      this.error.set(err.message || 'Erro ao confirmar o código.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  async resendConfirmationEmail(force = false): Promise<void> {
    if (!this.userEmail() || (this.resendTimer() > 0 && !force)) return;


    this.loading.set(true);
    this.error.set(null);

    try {
      await this.cognitoService.resendSignUpCode(this.userEmail()!);
      this.toastService.success('Código reenviado com sucesso! Verifique seu e-mail.');
      this.startResendTimer();
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao reenviar o código.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }
}

