import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-date-picker',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatButtonModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatDatepicker,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',

})
export class DatePickerComponent {
  label = input<string>('');
  placeholder = input<string>('');
  control = input<FormControl<Date | null>>(new FormControl(null));
  minDate = new Date();

  constructor(private controlContainer: ControlContainer) { }

  isRequired(): boolean {
    const ctrl = this.control();
    if (!ctrl || !ctrl.validator) return false;

    const validator = ctrl.validator({} as AbstractControl);
    return validator ? validator['required'] !== undefined : false;
  }

}
