import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent implements OnInit {

  // @ts-ignore
  @Input('form-control') formControl: FormControl;

  constructor() {
  }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    }

    return null;
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.hasError('required')) {
      return 'Campo Obrigatório';

    } else if (this.formControl.hasError('minlength')) {
      const requiredLength = this.formControl.errors?.minlength?.requiredLength;
      return `No mínimo ${requiredLength} caracteres`;

    } else if (this.formControl.hasError('maxlength')) {
      const requiredLength = this.formControl.errors?.maxlength?.requiredLength;
      return `No máximo ${requiredLength} caracteres`;

    } else if (this.formControl.hasError('email')) {
      return `Formato de Email Inválido`;
    }

    return null;
  }
}
