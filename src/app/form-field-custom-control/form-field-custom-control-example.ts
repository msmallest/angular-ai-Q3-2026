import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MyTel, MyTelInput } from './example-tel-input-example';

/** @title Form field with custom telephone number input control. */
@Component({
  selector: 'form-field-custom-control-example',
  templateUrl: 'form-field-custom-control-example.html',
  imports: [FormField, MatFormField, MatHint, MatLabel, MatIcon, JsonPipe, MatSuffix, MyTelInput],
})
export class FormFieldCustomControlExample {
  readonly formModel = signal<{ tel: MyTel | null }>({ tel: null });

  readonly form = form(this.formModel, (schemaPath) => {
    required(schemaPath.tel);
  });
}
