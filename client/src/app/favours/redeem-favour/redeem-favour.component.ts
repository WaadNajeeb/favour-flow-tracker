import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TextAreaComponent } from '../../shared/text-area/text-area.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeleteResponse, ImageUploaderService, UploadResponse } from '../../services/image-uploader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Favour, FavourService, RedeemFavour } from '../../services/favour.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-redeem-favour',
  imports: [MatIconModule, TextAreaComponent, CommonModule, MatCheckboxModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatButtonModule,
    ReactiveFormsModule,
    MatInputModule, MatError,
    MatRadioModule, TextAreaComponent, MatButtonToggleModule, MatSlideToggleModule, DatePipe],

  templateUrl: './redeem-favour.component.html',
  styleUrl: './redeem-favour.component.scss'
})
export class RedeemFavourComponent {

  private fb = inject(FormBuilder);
  private uploadService = inject(ImageUploaderService);
  protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  private router = inject(Router);
  favourId!: string;
  favour?: Favour;

  redeemForm = this.fb.group<RedeemFavourFormMode>({
    message: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    photoProof: this.fb.control(null, { nonNullable: true })
  });

  // local state
  previewUrl: string | null = null;
  uploading = false;
  uploadError = '';
  private destroyRef = inject(DestroyRef);
  readonly maxBytes = 10 * 1024 * 1024; // 10MB
  readonly allowedTypes = ['image/png', 'image/jpeg'];

  constructor(
    private route: ActivatedRoute,
    private favourService: FavourService,
  ) { }

  ngOnInit(): void {
    // Get ID from URL
    this.favourId = this.route.snapshot.paramMap.get('id')!;
    if (this.favourId) {
      this.loadFavour(this.favourId);
    }
  }

  loadFavour(id: string) {
    this.favourService.getFavour(id).pipe(
    ).subscribe({
      next: data => {
        this.favour = data;
        if (this.favour?.status == 'RequiresVerify' || this.favour?.status == 'Completed') {
          this.router.navigate(['']);
        }
        if (this.favour?.proofRequired) {
          this.redeemForm.controls.photoProof.addValidators(Validators.required);
          this.redeemForm.updateValueAndValidity();
        }
      },
      error: err => console.error('Failed to load favour', err)
    });
  }

  get getUserFullName() {
    return this.favour ? `${this.favour?.from?.firstName} ${this.favour?.from?.lastName}` : '';
  }

  /** Handle manual file select */
  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.setFile(input.files[0]);
  }

  private setFile(file: File) {
    this.uploadError = '';

    // validate
    if (!this.allowedTypes.includes(file.type)) {
      this.uploadError = 'Only PNG or JPG images are allowed.';
      return;
    }
    if (file.size > this.maxBytes) {
      this.uploadError = 'Image must be 10MB or smaller.';
      return;
    }

    // preview
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result as string);
    reader.readAsDataURL(file);

    // upload
    this.uploading = true;
    this.uploadService.uploadPicture(file, `${this.favourId}_proof`).subscribe({
      next: (res: UploadResponse) => {
        this.uploading = false;
        this.redeemForm.controls.photoProof.setValue(res.imageUrl ?? '');
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = err?.message || 'Upload failed';
        this.redeemForm.controls.photoProof.setValue('');
      }
    });
  }

  removeImage() {
    const imageName = `${this.favourId}_proof`;

    this.uploadService.deleteProfilePicture(imageName).subscribe({

      next: (res: DeleteResponse) => {
        this.previewUrl = null;
        this.uploadError = '';
        this.redeemForm.controls.photoProof.setValue('');
      },
      error: (err) => {
        this.previewUrl = null;
        this.uploadError = '';
        this.redeemForm.controls.photoProof.setValue('');
      }
    }
    )



  }

  redeemFavour() {
    if (!this.redeemForm.valid) return;

    const formValue = this.redeemForm.value as RedeemFavour;
    if (this.favourId) {
      // Update existing favour
      this.favourService.redeemFavour(this.favourId, formValue).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.notificationService.success('Favour updated', 'Success');
          this.router.navigateByUrl('/my-favours/pending-verifications');
        })
      ).subscribe();

    }
  }
}

export interface RedeemFavourFormMode {
  message: FormControl<string>
  photoProof: FormControl<string | null>
}

export interface RedeemFavourModel {
  message: string;
  photoProof: string | null;
  agree: boolean
}
