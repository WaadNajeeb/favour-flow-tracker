import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl, ControlContainer, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-area',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule, ReactiveFormsModule],
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.scss'
})
export class TextAreaComponent {
  label = input<string>('');
  showLabel = input<boolean>(true);
  placeholder = input<string>('');
  control = input<FormControl>(new FormControl(null));

  constructor(private controlContainer: ControlContainer) { }

  isRequired(): boolean {
    return false
  }
}
