import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommunityLeaderboard, FavourService } from '../services/favour.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { filter, BehaviorSubject, combineLatest, switchMap, map } from 'rxjs';
import { MatDivider } from '@angular/material/divider';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule, MatCardModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule,
    NgClass, MatSelectModule, AsyncPipe, MatTableModule, MatPaginatorModule, MatDivider, TableModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',

})
export class LeaderboardComponent {


  private favourService = inject(FavourService);
  private fb = inject(FormBuilder);
  // Define searchTerm and currentPage as BehaviorSubjects
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly currentPage$ = new BehaviorSubject<number>(1);
  displayedColumns: string[] = ['rank', 'user', 'completed', 'score'];

  top3User$ = this.favourService.getCommunityFavours().pipe(
      filter(users => users !== null),
      map(users => {
        if (!users || users.length === 0) return [];

        const first = users.find(u => u.rank === 1);
        const second = users.find(u => u.rank === 2);
        const third = users.find(u => u.rank === 3);

        // Always put #1 in middle, but only include if it exists
        const ordered: CommunityLeaderboard[] = [];
        if (second) ordered.push(second);
        if (first) ordered.push(first);
        if (third) ordered.push(third);

        return ordered;
      })
    );


  searchForm = new FormGroup<SearchTermFG>({
    searchTerm: new FormControl<string>('')
  })
  // Combine observables and fetch menu items
  readonly menuItems$ = combineLatest([
    this.searchTerm$,
    this.currentPage$,
  ]).pipe(
    switchMap(([searchTerm, currentPage]) =>
      this.favourService.getLeaderboard(searchTerm, currentPage)
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
}


export interface SearchTermFG {
  searchTerm: FormControl<string | null>;
}

