import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-password',
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule],
    templateUrl: './password.component.html',
    styleUrl: './password.component.scss',

})
export class PasswordComponent {
  readonly control = input<FormControl>(new FormControl<string | null>(''));
  readonly label = input<string>('Password');
  readonly required = input<boolean>(true);
  readonly autofocus = input<boolean>(false);
  protected showPassword: boolean = false;

}
