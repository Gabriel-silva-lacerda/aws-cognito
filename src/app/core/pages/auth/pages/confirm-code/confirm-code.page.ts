import { Component, inject, signal, ChangeDetectionStrategy, OnInit, viewChild, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ToastService } from '@shared/services/toast/toast.service';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { AUTH_FIELDS } from '../../constants/auth.fields';
import { ResendTimerService } from './services/resend-timer.service';

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
  host: {
    '(keydown.enter)': 'handleEnterKey()',
  },
})
export class ConfirmCodePage implements OnInit {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);
  private resendTimerService = inject(ResendTimerService);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');

  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected userEmail = signal<string | null>(null);
  protected resendTimer = this.resendTimerService.timer;
  protected confirmFields: iDynamicField[] = AUTH_FIELDS().CONFIRM;

  ngOnInit(): void {
    this.initializeConfirmCodePage();
  }

  private initializeConfirmCodePage(): void {
    const storedEmail = localStorage.getItem('confirmEmail');
    this.userEmail.set(storedEmail);

    const resendOnConfirm = localStorage.getItem('resendOnConfirm') === 'true';
    if (resendOnConfirm && !this.resendTimerService.isCoolingDown) {
      this.resendConfirmationEmail(true);
    }

    localStorage.removeItem('resendOnConfirm');
  }

  protected async resendConfirmationEmail(force = false): Promise<void> {
    if (!this.userEmail()) return;

    if (this.resendTimerService.isCoolingDown && !force) {
      this.toastService.warning(
        `Verifique seu e-mail. Você poderá reenviar o código em ${this.resendTimerService.timer()} segundos.`
      );
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.cognitoService.resendSignUpCode(this.userEmail()!);
      this.toastService.success('Código reenviado com sucesso! Verifique seu e-mail.');
      this.resendTimerService.startTimer();
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao reenviar o código.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  protected async onSubmit(): Promise<void> {
    const formValue = this.dynamicFormRef()?.form?.getRawValue();
    if (!this.dynamicFormRef()?.form?.valid || !this.userEmail()) {
      this.error.set('E-mail do usuário não definido ou formulário inválido.');
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

  protected handleEnterKey(): void {
    if (!this.loading() && this.dynamicFormRef()?.form?.valid) {
      this.onSubmit();
    }
  }
}


