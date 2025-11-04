import { PROFILE_FIELDS } from './../constants/profile.fields';
import { Component, inject, signal, viewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@core/pages/auth/services/auth.service';
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
  public authService = inject(AuthService);

  protected loading = {
    user: signal(false),
    update: signal(false),
  };

  protected error = signal<string | null>(null);
  protected success = signal<string | null>(null);

  protected profileFields: iDynamicField[] = PROFILE_FIELDS().PROFILE;

  async ngAfterViewInit() {
    await this.authService.initialize();
    await this.loadUserProfile();
  }

  protected async loadUserProfile() {
    const formRef = this.dynamicFormRef()?.form;
    const user =  this.authService.user();
    formRef?.patchValue?.({
      email: user?.email,
      name: user?.name || '',
    });
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
      this.authService.user.update(user => {
        if (user) {
          return { ...user, name: formValue.name };
        }
        return user;
      });
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
