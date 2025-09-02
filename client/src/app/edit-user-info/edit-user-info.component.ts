import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-edit-user-info',
  imports: [],
  templateUrl: './edit-user-info.component.html',
  styleUrl: './edit-user-info.component.scss',

})
export class EditUserInfoComponent {


  private accountService = inject(AccountService);



}
