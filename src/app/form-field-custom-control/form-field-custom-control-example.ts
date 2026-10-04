import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { NameInput } from './name-input';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/** @title Form field with a custom name input control. */
@Component({
  selector: 'form-field-custom-control-example',
  template: `
    <mat-form-field>
      <mat-label>Name</mat-label>
      <example-name-input [formField]="form.name" />
      @if (form.name().getError('required')) {
        <mat-error>Name is required</mat-error>
      }
    </mat-form-field>
    <p>Entered value: {{ form.name().value() | json }}</p>

    <mat-form-field>
      <mat-label>Name</mat-label>
      <example-name-input [formControl]="reactiveForm.controls.name" />
      @if (reactiveForm.controls.name.hasError('required')) {
        <mat-error>Name is required</mat-error>
      }
    </mat-form-field>
    <p>Entered value: {{ reactiveForm.controls.name.value | json }}</p>
  `,
  imports: [FormField, MatFormField, MatLabel, MatError, JsonPipe, NameInput, ReactiveFormsModule],
})
export class FormFieldCustomControlExample {
  readonly formModel = signal({ name: '' });

  readonly form = form(this.formModel, (schemaPath) => {
    required(schemaPath.name);
  });

  readonly reactiveForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
}
