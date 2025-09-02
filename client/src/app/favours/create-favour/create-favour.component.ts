import { Component, DestroyRef, inject } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TextFieldComponent } from "../../shared/text-field/text-field.component";
import { TextAreaComponent } from "../../shared/text-area/text-area.component";
import { DropdownComponent } from "../../shared/dropdown/dropdown.component";
import { DatePickerComponent } from "../../shared/date-picker/date-picker.component";
import { FavourService, Result } from '../../services/favour.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';
import { LoginResponse } from '../../../models/user';
import { Router } from '@angular/router';
import { TimePickerComponent } from "../../shared/time-picker/time-picker.component";
@Component({
  selector: 'app-create-favour',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatButtonModule,
    ReactiveFormsModule,
    MatInputModule, MatError,
    MatRadioModule, TextFieldComponent, TextAreaComponent, DropdownComponent, DatePickerComponent, AsyncPipe, MatButtonToggleModule, MatSlideToggleModule, DatePickerComponent, TimePickerComponent],
  templateUrl: './create-favour.component.html',
  styleUrl: './create-favour.component.scss'
})
export class CreateFavourComponent {
  rewards = ['Gift Card', 'Coffee', 'Shoutout', 'Money'];
  private fb = inject(FormBuilder);
  private favourService = inject(FavourService);
  private destroyRef = inject(DestroyRef);
  protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  private router = inject(Router)

  durationType = ['Minutes', 'Hours', 'Days'];
  durationForMin = Array.from({ length: 60 }, (_, i) => i + 1);
  durationHours = Array.from({ length: 24 }, (_, i) => i + 1);
  durationDays = Array.from({ length: 30 }, (_, i) => i + 1);

  duration = this.durationDays;
  users$ = this.favourService.getAllUsers().pipe();
  favourForm = this.fb.group<FavourModelForm>({
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    rewards: this.fb.control([], { nonNullable: true }),
    to: this.fb.control(null, { nonNullable: true }),
    requiredBy: this.fb.control(undefined as unknown as Date, { nonNullable: true }),
    dueTime: this.fb.control('', { nonNullable: true }),
    proofRequired: this.fb.control(false, { nonNullable: true }),
    favourType: this.fb.control('Public', { nonNullable: true, validators: [Validators.required] }),
    additionalNotes: this.fb.control(null),
    requirements: this.fb.control([], { nonNullable: true }),
    duration: this.fb.control(0, { nonNullable: true }),
    durationType: this.fb.control('Days' as DurationType, { nonNullable: true }),
    priority: this.fb.control('Medium', { nonNullable: true }),
  });

  durationOptions(dropdownValue: string): number[] {
    switch (dropdownValue) {
      case 'Minutes':
        return Array.from({ length: 60 }, (_, i) => i + 1); // 1–60
      case 'Hours':
        return Array.from({ length: 24 }, (_, i) => i + 1); // 1–24
      case 'Days':
        return Array.from({ length: 30 }, (_, i) => i + 1); // 1–30
      default:
        return [];
    }
  }


  onDurationSelected(value: any) {
    const dropdownValue = value as string;
    switch (dropdownValue) {
      case 'Minutes':
       this.duration = this.durationForMin;
       break;
      case 'Hours':
          this.duration = this.durationHours;
       break;
      case 'Days':
          this.duration = this.durationDays;
       break;
    }
  }
  onSubmit() {
    if (!this.favourForm.valid) {
      return;
    }
    console.log('testing')
    const formValue = this.favourForm.value as FavourModel;

    this.favourService.createFavour(formValue).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((response: Result<FavourModel>) => {
        if (response?.success && response.result) {
          this.handleLoginSuccess(response.result);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const fallbackMessage = 'Unknown error, please try again later.';
        const errorMessage = error?.error?.message || fallbackMessage;

        this.favourForm.setErrors({ submissionError: { message: errorMessage } });
        this.progressService.hide();

        return EMPTY;
      })
    ).subscribe();
  }

  private handleLoginSuccess(user: FavourModel) {

    this.progressService.hide();
    this.notificationService.success("Favour has been created", "Favour Created");
    this.router.navigateByUrl('/my-favours', { replaceUrl: true });
  }

}


export interface FavourModel {
  title: string;
  description?: string;
  rewards: string[];
  to?: string | null;
  requiredBy?: Date;
  proofRequired?: boolean;
  favourType: FavourType;
  additionalNotes: string;
  requirements: string[];
  duration?: number;
  durationType?: DurationType;
  priority: PriorityType;
  dueTime: string;
}

export interface FavourModelForm {
  title: FormControl<string>;
  description: FormControl<string>;
  rewards: FormControl<string[]>;
  to: FormControl<string | null>;
  requiredBy: FormControl<Date>;
  proofRequired: FormControl<boolean>;
  favourType: FormControl<FavourType>;
  additionalNotes: FormControl<string | null>;
  requirements: FormControl<string[]>;
  duration: FormControl<number | null>;
  durationType: FormControl<DurationType | null>;
  priority: FormControl<PriorityType>;
  dueTime: FormControl<string | null>
}


export type FavourStatus = 'Open' | 'Pending' | 'RequiresVerify' | 'Completed';
export type FavourType = 'Personal' | 'Public';
export type DurationType = 'Minutes' | 'Hours' | 'Days';
export type PriorityType = 'Low' | 'Medium' | 'High' | 'Urgent';
