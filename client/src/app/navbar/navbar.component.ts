import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDivider } from '@angular/material/divider';
import { User } from '../../models/user';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { UserNavProfileComponent } from "../user-nav-profile/user-nav-profile.component";
@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive, MatBadgeModule, MatMenuModule, CommonModule, MatSidenav, RouterOutlet, MatSidenavContent, MatSidenavContainer, UserNavProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  user2!: User | null;

  @Output() clicked: EventEmitter<boolean> = new EventEmitter();
  isExpanded: boolean = false;

  private accountService = inject(AccountService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.user2 = this.accountService.getUser();
  }

  user$ = this.accountService.getCurrentUser().pipe();

  formGroup: FormGroup = new FormGroup({
    search: new FormControl<string | null>(null)
  });


  logout() {
    this.authService.logout();
  }
}
