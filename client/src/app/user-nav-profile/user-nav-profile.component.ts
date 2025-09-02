import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-nav-profile',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    AsyncPipe, MatBadgeModule, MatMenuModule, MatDivider, CommonModule],
  templateUrl: './user-nav-profile.component.html',
  styleUrl: './user-nav-profile.component.scss',

})
export class UserNavProfileComponent {
  private accountService = inject(AccountService);
  private authService = inject(AuthService);


  user$ = this.accountService.getCurrentUser().pipe();



  logout() {
    this.authService.logout();
  }

}
