import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { MatError, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { PasswordComponent } from "../password/password.component";
import { AuthService, Login } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';
import { HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoginResponse, User } from '../../../models/user';
@Component({
  selector: 'app-sign-in',
  imports: [MatIcon, MatFormFieldModule, MatCheckboxModule, MatButtonModule, ReactiveFormsModule, MatError, MatInputModule, PasswordComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  private destroyRef = inject(DestroyRef);
   protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  protected authService = inject(AuthService);
  private fb = inject(FormBuilder);
  protected router = inject(Router);

  protected localStorageService = inject(LocalStorageService);

  signInForm = this.fb.group<SignInForm>({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, [Validators.required]),
    rememberMe: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });

  onSubmit() {
    const formValue = this.signInForm.value as Login;

    this.authService.login2(formValue).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((response: LoginResponse) => {
        if (response?.success && response.user) {
          this.handleLoginSuccess(response.user);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        const fallbackMessage = 'Unknown error, please try again later.';
        const errorMessage = error?.error?.message || fallbackMessage;

        this.signInForm.setErrors({ submissionError: { message: errorMessage } });
        this.progressService.hide();

        return EMPTY;
      })
    ).subscribe();
  }

  private handleLoginSuccess(user: User) {
    this.localStorageService.setItem('user', user);
    this.router.navigate(['']);
    this.progressService.hide();
  }

}


export interface SignInForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  rememberMe: FormControl<boolean | null>;
}

