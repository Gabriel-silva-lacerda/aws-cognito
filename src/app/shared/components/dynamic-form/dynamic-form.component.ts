import { ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, input, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ERROR_MESSAGES } from './errors/form-errors';
import { iDynamicField } from './interfaces/dynamic-filed';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoadingComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  animations: []
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: iDynamicField[] = [];
  public loading = input(false);

  @Output() fieldChangeEvent = new EventEmitter<{
    fieldName: string;
    value: string;
  }>();

  private fb = inject(FormBuilder);

  public form!: FormGroup;
  public selectedFileName!: string;
  public imagePreviewUrl: string | null = null;
  public isDisabled: { [key: string]: boolean } = {};
  public tempTimeInterval: { [key: string]: { start?: string; end?: string } } = {};

  constructor(@Inject(ERROR_MESSAGES) private errors: any) {}

  ngOnInit() {
    this.creatForm();
    this.fields.forEach(field => {
      this.isDisabled[field.name] = field.disabled ?? false;
    });
  }

  creatForm() {
    this.form = this.fb.group(
      this.fields.reduce((acc, field) => {
        const controlState = { value: '', disabled: field.disabled ?? false };

        acc[field.name] =
          field.type === 'multiselect'
            ? [[], field.validators || []]
            : [controlState, field.validators || []];

        return acc;
      }, {} as { [key: string]: [any, ValidatorFn | ValidatorFn[]] }),
    );
  }


  onFileSelected(event: Event, field: iDynamicField) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.form.patchValue({ [field.name]: file });
      this.selectedFileName = file.name;
      this.imagePreviewUrl = URL.createObjectURL(file);

      if (field.onFileUpload) {
        field.onFileUpload(file, this.form);
      }
    } else {
      this.selectedFileName = '';
      this.imagePreviewUrl = null;
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

  getGroupErrorMessage(errorKey: string): string {
    const errorFn = (this.errors as any)[errorKey];
    return errorFn ? errorFn({}) : 'Erro desconhecido';
  }

  disableFields(fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control && !control.disabled) {
        control.disable();
      }
    });
    fieldNames.forEach(fieldName => (this.isDisabled[fieldName] = true));
  }

  enableFields(fieldNames: string[]) {
    fieldNames.forEach(fieldName => {
      const control = this.form.get(fieldName);
      if (control && control.disabled) {
        control.enable();
      }
    });
    fieldNames.forEach(fieldName => (this.isDisabled[fieldName] = false));
  }

  clearFields(fieldNames: string[]) {
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
}
