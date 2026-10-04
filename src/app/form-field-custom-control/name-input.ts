import {
  Component,
  ElementRef,
  booleanAttribute,
  computed,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatFormFieldControl } from '@angular/material/form-field';

/** Custom text input that plugs into both Signal Forms and `mat-form-field`. */
@Component({
  selector: 'example-name-input',
  template: `
    <input
      #input
      class="example-name-input-element"
      [value]="value()"
      [disabled]="disabled()"
      [required]="required()"
      [attr.aria-describedby]="describedBy()"
      (input)="value.set(input.value)"
      (focus)="focused.set(true)"
      (blur)="focused.set(false); touched.set(true)"
    />
  `,
  styles: `
    .example-name-input-element {
      border: none;
      background: none;
      padding: 0;
      outline: none;
      font: inherit;
      color: currentcolor;
      width: 100%;
    }
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: NameInput }],
  host: {
    '[id]': 'id',
  },
})
export class NameInput implements FormValueControl<string>, MatFormFieldControl<string> {
  static nextId = 0;

  // Signal Forms binds these to the field's state.
  readonly value = model('');
  readonly touched = model(false);
  readonly required = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  // Required by MatFormFieldControl.
  readonly ngControl = null;
  readonly controlType = 'example-name-input';
  readonly id = `example-name-input-${NameInput.nextId++}`;
  readonly placeholder = input('');
  readonly userAriaDescribedBy = input('', { alias: 'aria-describedby' });
  readonly focused = signal(false);
  readonly empty = computed(() => !this.value());
  readonly shouldLabelFloat = computed(() => this.focused() || !this.empty());
  readonly errorState = computed(() => this.touched() && this.required() && this.empty());

  private readonly _input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  protected readonly describedBy = signal('');

  setDescribedByIds(ids: string[]) {
    this.describedBy.set(ids.join(' '));
  }

  onContainerClick() {
    this._input().nativeElement.focus();
  }
}
