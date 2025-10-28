import { Component, signal, computed, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CognitoService } from '../../../../../shared/services/cognito/cognito.service';
import { iDynamicField } from '../../../../../shared/components/dynamic-form/interfaces/dynamic-filed';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { ToastService } from '../../../../../shared/services/toast/toast.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ RouterModule, DynamicFormComponent, LoadingComponent],
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss']
})
export class SignInPage {
  private router = inject(Router);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);
  private cognitoService = inject(CognitoService);

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  protected signInFields: iDynamicField[] = [
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
  ];

  async onSubmit() {
    const formValue = this.dynamicFormRef()?.form?.getRawValue();
    if (!formValue?.email || !formValue?.password) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.cognitoService.signIn(formValue.email, formValue.password);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao entrar. Verifique suas credenciais.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.set(false);
    }
  }
}
