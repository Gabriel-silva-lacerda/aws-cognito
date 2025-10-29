import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { ToastService } from '@shared/services/toast/toast.service';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AUTH_FIELDS } from '../../constants/auth.fields';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DynamicFormComponent,
    LoadingComponent
  ],
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  host: {
    '(keydown.enter)': 'handleEnterKey()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpPage {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected signUpFields: iDynamicField[] = AUTH_FIELDS().SIGN_UP;

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
      await this.cognitoService.signUp(formValue.email, formValue.password, formValue.name);

      localStorage.setItem('confirmEmail', formValue.email);

      this.router.navigateByUrl('/auth/confirm');
    } catch (err: any) {
      console.error(err);
      this.error.set(err.message || 'Erro ao criar conta.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }
}
