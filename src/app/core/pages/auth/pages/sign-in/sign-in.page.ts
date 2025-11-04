import { Component, signal, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { ToastService } from '@shared/services/toast/toast.service';
import { AUTH_FIELDS } from '../../constants/auth.fields';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ RouterModule, DynamicFormComponent, LoadingComponent],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  host: {
    '(keydown.enter)': 'handleEnterKey()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInPage {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);

  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected signInFields: iDynamicField[] = AUTH_FIELDS().SIGN_IN;

  protected handleEnterKey(): void {
    if (!this.loading() && this.dynamicFormRef()?.form?.valid) {
      this.onSubmit();
    }
  }

  protected async onSubmit() {
    const formValue = this.dynamicFormRef()?.form?.getRawValue();
    if (!formValue?.email || !formValue?.password) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const result = await this.cognitoService.signIn(formValue.email, formValue.password);

      if(result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        this.goToConfirm();
        return;
      }
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao entrar. Verifique suas credenciais.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }

  private goToConfirm() {
    localStorage.setItem('confirmEmail', this.dynamicFormRef()?.form?.get('email')?.value);
    localStorage.setItem('resendOnConfirm', 'true');
    this.router.navigateByUrl('/auth/confirm');
  }
}
