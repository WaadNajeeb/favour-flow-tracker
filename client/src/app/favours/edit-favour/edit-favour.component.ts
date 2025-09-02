import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { TextFieldComponent } from '../../shared/text-field/text-field.component';
import { TimePickerComponent } from '../../shared/time-picker/time-picker.component';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';
import { Favour, FavourService, Result } from '../../services/favour.service';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';
import { FavourModelForm, DurationType, FavourModel, FavourType, PriorityType } from '../create-favour/create-favour.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-favour',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatButtonModule,
    ReactiveFormsModule,
    MatInputModule, MatError,
    MatRadioModule, TextFieldComponent, TextAreaComponent, DropdownComponent, DatePickerComponent, MatButtonToggleModule, MatSlideToggleModule, DatePickerComponent, TimePickerComponent],
  templateUrl: './edit-favour.component.html',
  styleUrl: './edit-favour.component.scss'
})
export class EditFavourComponent {

  private fb = inject(FormBuilder);
  private favourService = inject(FavourService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  private destroyRef = inject(DestroyRef); // use correct destroyRef if using standalone inject

  favourId: string | null = null;
  users$ = this.favourService.getAllUsers().pipe();
  rewards = ['Gift Card', 'Coffee', 'Shoutout', 'Money'];
  durationType = ['Minutes', 'Hours', 'Days'];
  durationForMin = Array.from({ length: 60 }, (_, i) => i + 1);
  durationHours = Array.from({ length: 24 }, (_, i) => i + 1);
  durationDays = Array.from({ length: 30 }, (_, i) => i + 1);
  duration = this.durationDays;

  favourForm = this.fb.group<FavourModelForm>({
    title: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    description: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    rewards: this.fb.control([], { nonNullable: true }),
    to: this.fb.control(null, { nonNullable: true }),
    requiredBy: this.fb.control(undefined as unknown as Date, { nonNullable: true }),
    dueTime: this.fb.control('', { nonNullable: true }),
    proofRequired: this.fb.control(false, { nonNullable: true }),
    favourType: this.fb.control('Public' as FavourType, { nonNullable: true, validators: [Validators.required] }),
    additionalNotes: this.fb.control(null),
    requirements: this.fb.control([], { nonNullable: true }),
    duration: this.fb.control(0, { nonNullable: true }),
    durationType: this.fb.control('Days' as DurationType, { nonNullable: true }),
    priority: this.fb.control('Medium' as PriorityType, { nonNullable: true }),
  });
  favour!: Favour;

  ngOnInit(): void {
    // Get favour ID from route
    this.favourId = this.route.snapshot.paramMap.get('id');

    if (this.favourId) {
      this.favourService.getFavour(this.favourId).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((favour: Favour) => {
          this.favour = favour;
          // Patch the form with existing values
          this.favourForm.setValue({
            title: favour.title,
            description: favour.description ?? '',
            rewards: favour.rewards ?? [],
            to: favour.to?._id ?? null,
            requiredBy: favour.requiredBy ?? (undefined as unknown as Date),
            dueTime: favour.dueTime ?? '',
            proofRequired: favour.proofRequired ?? false,
            favourType: favour.favourType,
            additionalNotes: favour.additionalNotes ?? null,
            requirements: favour.requirements ?? [],
            duration: favour.duration ?? 0,
            durationType: favour.durationType ?? 'Days',
            priority: favour.priority,
          });
          this.favourForm.updateValueAndValidity();

          // Update duration options based on favourType
          if (favour.durationType) {
            this.onDurationSelected(favour.durationType);
          }
        })
      ).subscribe();
    }
  }

  durationOptions(dropdownValue: string): number[] {
    switch (dropdownValue) {
      case 'Minutes': return this.durationForMin;
      case 'Hours': return this.durationHours;
      case 'Days': return this.durationDays;
      default: return [];
    }
  }

  onDurationSelected(value: string) {
    switch (value) {
      case 'Minutes': this.duration = this.durationForMin; break;
      case 'Hours': this.duration = this.durationHours; break;
      case 'Days': this.duration = this.durationDays; break;
    }
  }

  onSubmit() {
    if (!this.favourForm.valid) return;

    const formValue = this.favourForm.value as FavourModel;

    if (this.favourId) {
      // Update existing favour
      this.favourService.updateFavour(this.favourId, formValue).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.notificationService.success('Favour updated', 'Success');
          this.router.navigateByUrl('/my-favours/owed-to-me');
        })
      ).subscribe();
    } else {
      // Optional: create new favour
      this.favourService.createFavour(formValue).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.notificationService.success('Favour created', 'Success');
          this.router.navigateByUrl('/my-favours');
        })
      ).subscribe();
    }
  }
}
