import { Component, input } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTimepickerModule} from '@angular/material/timepicker';
@Component({
  selector: 'app-time-picker',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatButtonModule, MatFormFieldModule, MatButtonModule, MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule, MatTimepickerModule],
     providers: [provideNativeDateAdapter()],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss'
})
export class TimePickerComponent {
label = input<string>('');
  placeholder = input<string>('');
  control = input<FormControl<string | null>>(new FormControl(null));

  constructor(private controlContainer: ControlContainer) { }

  isRequired(): boolean {
    const ctrl = this.control();
    if (!ctrl || !ctrl.validator) return false;

    const validator = ctrl.validator({} as AbstractControl);
    return validator ? validator['required'] !== undefined : false;
  }

   onTimeChange(event: any) {
    if (event.value) {
      const date: Date = event.value;
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.control().setValue(`${hours}:${minutes}`);
    }
  }
}
