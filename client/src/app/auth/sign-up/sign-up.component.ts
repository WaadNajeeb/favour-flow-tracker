
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PasswordComponent } from "../password/password.component";
import { ImageUploaderService, UploadResponse } from '../../services/image-uploader.service';
import { AuthService, Register } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap, catchError, EMPTY } from 'rxjs';
import { LoginResponse, RegisterResponse, User } from '../../../models/user';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [MatIcon, MatFormFieldModule, MatCheckboxModule, MatButtonModule, ReactiveFormsModule, MatError, MatInputModule, PasswordComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {

  private fb = inject(FormBuilder);
  private uploadService = inject(ImageUploaderService);
    private destroyRef = inject(DestroyRef);
  protected authService = inject(AuthService);
  protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  protected router = inject(Router);

  signUpForm = this.fb.group<SignUpForm>({
    firstName: new FormControl<string | null>(null, [Validators.required]),
    lastName: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
    confirmPassword: new FormControl<string | null>(null, [Validators.required]),
    agreement: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });

  uploadProfilePicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
  }
  profileImageUrl: string | null = null;

  onSubmit() {
    if(!this.signUpForm.valid) {

      return;
    }

    const formValue = this.signUpForm.value as Register;


    this.authService.register(formValue).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((response: RegisterResponse) => {
        if (response?.success) {
          this.handleLoginSuccess();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const fallbackMessage = 'Unknown error, please try again later.';
        const errorMessage = error?.error?.message || fallbackMessage;
        this.signUpForm.setErrors({ submissionError: { message: errorMessage } });
        this.progressService.hide();

        return EMPTY;
      })
    ).subscribe();
  }

  private handleLoginSuccess() {
    this.router.navigate(['/sign-in']);
    this.progressService.hide();
  }
}


export interface SignUpForm {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  agreement: FormControl<boolean | null>;
}

