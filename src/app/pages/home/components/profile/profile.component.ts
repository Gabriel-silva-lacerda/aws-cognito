import { Component, inject, signal, viewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormComponent } from '@shared/components/dynamic-form/dynamic-form.component';
import { iDynamicField } from '@shared/components/dynamic-form/interfaces/dynamic-filed';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CognitoService } from '@shared/services/cognito/cognito.service';
import { ToastService } from '@shared/services/toast/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DynamicFormComponent, LoadingComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements AfterViewInit {
  private cognitoService = inject(CognitoService);
  private dynamicFormRef = viewChild<DynamicFormComponent>('dynamicForm');
  private toastService = inject(ToastService);

  protected loading = {
    user: signal(false),
    update: signal(false),
  };

  protected error = signal<string | null>(null);
  protected success = signal<string | null>(null);

  protected profileFields: iDynamicField[] = [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      disabled: true,
      padding: '10px',
    },
    {
      name: 'name',
      label: 'Nome',
      type: 'text',
      validators: [Validators.required],
      padding: '10px',
    },
  ];

  ngAfterViewInit(): void {
    this.loadUserProfile();
  }

  protected async loadUserProfile() {
    this.loading.user.set(true);
    const formRef = this.dynamicFormRef()?.form;
    try {
      const user = await this.cognitoService.getCurrentUser();
      formRef?.patchValue?.({
        email: user.email,
        name: user.name || '',
      });
    } catch (err: any) {
      console.error(err);
      this.error.set(err.message || 'Erro ao carregar perfil.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.user.set(false);
    }
  }

  protected async onSubmit() {
    const formRef = this.dynamicFormRef()?.form;
    if (!formRef?.valid) return;

    const formValue = formRef.getRawValue();
    const attributesToUpdate: Record<string, string> = {
      name: formValue.name,
    };

    this.loading.update.set(true);
    this.error.set(null);
    this.success.set(null);

    try {
      await this.cognitoService.updateUser(attributesToUpdate);
      this.success.set('Perfil atualizado com sucesso!');
      this.toastService.success(this.success()!);
    } catch (err: any) {
      console.error(err);
      this.error.set(err.message || 'Erro ao atualizar perfil.');
      this.toastService.error(this.error()!);
    } finally {
      this.loading.update.set(false);
    }
  }
}
