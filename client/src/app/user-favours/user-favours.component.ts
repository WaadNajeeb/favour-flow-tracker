import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FavourService } from '../services/favour.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-user-favours',
  imports: [MatCardModule, MatIconModule, MatTabsModule, MatPaginatorModule,
    MatButtonModule, AsyncPipe, MatBadgeModule, RouterOutlet, RouterModule,
    NgClass],
  templateUrl: './user-favours.component.html',
  styleUrl: './user-favours.component.scss',

})
export class UserFavoursComponent {

  private favourService = inject(FavourService);
  favoursCount$ = this.favourService.favourCounts().pipe();
  private accountService = inject(AccountService);

  points$ = this.accountService.getCurrentUser().pipe(map(e => e.points))

  selectedIndex = 0;

  // Tab route mapping
  routes: string[] = [
    'i-owe',
    'owed-to-me',
    'completed-for-me',
    'i-completed',
    'awaiting-verification',
    'pending-verifications'
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Update selectedIndex whenever the route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.split('/').pop(); // get last segment
        const index = this.routes.indexOf(url || '');
        if (index !== -1) this.selectedIndex = index;
      });
  }

  onTabChange(index: number) {
    this.router.navigate([this.routes[index]], { relativeTo: this.route });
    this.selectedIndex = index; // update selectedIndex immediately for UI feedback
  }

  onTabChangeByName(name: string){
    const idx = this.routes.indexOf(name);
    this.onTabChange(idx);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.endsWith(route);
  }
}
