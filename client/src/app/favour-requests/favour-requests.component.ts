import { CommonModule, NgClass, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, combineLatest, switchMap, filter } from 'rxjs';
import { SearchTermFG } from '../leaderboard/leaderboard.component';
import { FavourService } from '../services/favour.service';
import { RequestCardComponent } from "../request-card/request-card.component";
import { FavourRequestCardComponent } from "./favour-request-card/favour-request-card.component";
import { Router, RouterLink } from '@angular/router';
import { UiTextboxMaterialComponent } from '../shared/ui-textbox-material/ui-textbox-material.component';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-favour-requests',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, AsyncPipe, MatPaginatorModule, TableModule, MatButtonModule, FavourRequestCardComponent, RouterLink,
    MatFormFieldModule, ReactiveFormsModule, FormsModule, MatInputModule, UiTextboxMaterialComponent],
  templateUrl: './favour-requests.component.html',
  styleUrl: './favour-requests.component.scss'
})
export class FavourRequestsComponent {
  private favourService = inject(FavourService);
  private fb = inject(FormBuilder);
  // Define searchTerm and currentPage as BehaviorSubjects
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly currentPage$ = new BehaviorSubject<number>(1);

  private notificationService = inject(NotificationService)
  private router = inject(Router);
  private localStorageService = inject(LocalStorageService);
  searchForm = new FormGroup<SearchTermFG>({
    searchTerm: new FormControl<string>('')
  })
  // Combine observables and fetch menu items
  readonly menuItems$ = combineLatest([
    this.searchTerm$,
    this.currentPage$,
  ]).pipe(
    switchMap(([searchTerm, currentPage]) =>
      this.favourService.getPublicRequest(searchTerm, currentPage)
    )
  );

  ngOnInit(): void {
    this.searchForm.controls.searchTerm.valueChanges.pipe(
      filter((searchTerm: string | null) => searchTerm != null && searchTerm !== ''),

    ).subscribe((v: string | null) => {
      if (v) {
        this.onSearchChange(v);
      }

    });
  }

  onPageChange(event: any) {
    this.currentPage$.next(event.pageIndex + 1);
  }

  onSearchChange(term: string) {
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }

  get control() {
    return this.searchForm.controls.searchTerm;
  }

  goToCreateFavour() {
    if (this.localStorageService.getItem('user')) {
      this.router.navigate(['create-favour'])
    } else {
      this.notificationService.info("You must login first", "Create Favour")
    }

  }
}
