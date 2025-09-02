import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ControlContainer, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-field',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule, ReactiveFormsModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class TextFieldComponent {
  label = input<string>('');
  placeholder = input<string>('');
  control = input<FormControl>(new FormControl(''));

  constructor(private controlContainer: ControlContainer) { }
  isRequired(): boolean {
    const ctrl = this.control();
    if (!ctrl || !ctrl.validator) return false;

    const validator = ctrl.validator({} as AbstractControl);
    return validator ? validator['required'] !== undefined : false;
  }
}
