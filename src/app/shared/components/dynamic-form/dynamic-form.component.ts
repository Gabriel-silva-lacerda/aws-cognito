import { ValidatorFn } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ERROR_MESSAGES } from './errors/form-errors';
import { iDynamicField } from './interfaces/dynamic-filed';
import { LoadingComponent } from '../loading/loading.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoadingComponent, NgOptimizedImage, NgClass],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private errors: any = inject(ERROR_MESSAGES);

  public fields = input<iDynamicField[]>([]);
  public loading = input(false);
  public fieldChangeEvent = output<{ name: string; value: any }>();

  protected showPassword = signal<Record<string, boolean>>({});
  protected selectedFileName = signal<string>('');
  protected imagePreviewUrl = signal<string | null>(null);
  protected isDisabled = signal<{ [key: string]: boolean }>({});
  protected tempTimeInterval = signal<{ [key: string]: { start?: string; end?: string } }>({});

  public form!: FormGroup;

  ngOnInit() {
    this.creatForm();
    const initialDisabledState = this.fields().reduce((acc, field) => {
        acc[field.name] = field.disabled ?? false;
        return acc;
    }, {} as { [key: string]: boolean });
    this.isDisabled.set(initialDisabledState);
  }

  public creatForm() {
    const fields = this.fields();

    const formControls = fields.reduce((acc, field) => {
        const controlState = { value: '', disabled: field.disabled ?? false };

        acc[field.name] =
            field.type === 'multiselect'
                ? [[], field.validators || []]
                : [controlState, field.validators || []];

        return acc;
    }, {} as { [key: string]: [any, ValidatorFn | ValidatorFn[]] });

    this.form = this.fb.group(formControls);
  }

  public onFileSelected(event: Event, field: iDynamicField) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.form.patchValue({ [field.name]: file });
      this.selectedFileName.set(file.name);
      this.imagePreviewUrl.set(URL.createObjectURL(file));

      if (field.onFileUpload) {
        field.onFileUpload(file, this.form);
      }
    } else {
      this.selectedFileName.set('');
      this.imagePreviewUrl.set(null);
      this.form.get(field.name)?.setValue(null);
    }
  }

  getErrorsMessages(fieldName: string): string[] {
    const control = this.form.get(fieldName);
    const errors = control?.errors;

    if (!errors) return [];

    return Object.keys(errors).map(errorKey => {
      if (errorKey === 'customError' && errors['customError']) {
        return errors['customError'];
      }

      const errorFn = (this.errors as any)[errorKey];
      return errorFn ? errorFn(errors[errorKey]) : `Erro desconhecido`;
    });
  }

  public getGroupErrorMessage(errorKey: string): string {
    const errorFn = (this.errors as any)[errorKey];
    return errorFn ? errorFn({}) : 'Erro desconhecido';
  }

  public disableFields(fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control && !control.disabled) {
        control.disable();
      }
    });
    this.isDisabled.update(state => {
        fieldNames.forEach(fieldName => {
            state[fieldName] = true;
        });
        return { ...state };
    });
  }

  public enableFields(fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control && control.disabled) {
        control.enable();
      }
    });
    this.isDisabled.update(state => {
        fieldNames.forEach(fieldName => {
            state[fieldName] = false;
        });
        return { ...state };
    });
  }

  public clearFields(fieldNames: string[]) {
    const clearValues = fieldNames.reduce(
      (acc, fieldName) => {
        acc[fieldName] = null;
        return acc;
      },
      {} as { [key: string]: any },
    );

    this.form.patchValue(clearValues);
    this.enableFields(fieldNames);
  }

  public togglePasswordVisibility(field: iDynamicField) {
    const name = field.name;
    this.showPassword.update(state => {
        state[name] = !state[name];
        return { ...state };
    });
  }
}
