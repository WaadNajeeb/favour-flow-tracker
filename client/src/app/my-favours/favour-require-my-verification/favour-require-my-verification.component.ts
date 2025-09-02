import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, switchMap, filter } from 'rxjs';
import { SearchTermFG } from '../../leaderboard/leaderboard.component';
import { FavourService } from '../../services/favour.service';
import { FavourRequireMyVerificationCardComponent } from "./favour-require-my-verification-card/favour-require-my-verification-card.component";

@Component({
  selector: 'app-favour-require-my-verification',
 imports: [MatPaginatorModule, AsyncPipe, MatDivider, FavourRequireMyVerificationCardComponent],
  templateUrl: './favour-require-my-verification.component.html',
  styleUrl: './favour-require-my-verification.component.scss'
})
export class FavourRequireMyVerificationComponent {
  private favourService = inject(FavourService);
  private fb = inject(FormBuilder);
  // Define searchTerm and currentPage as BehaviorSubjects
  private readonly searchTerm$ = new BehaviorSubject<string>('');
  private readonly currentPage$ = new BehaviorSubject<number>(1);


  searchForm = new FormGroup<SearchTermFG>({
    searchTerm: new FormControl<string>('')
  })
  // Combine observables and fetch menu items
  readonly menuItems$ = combineLatest([
    this.searchTerm$,
    this.currentPage$,
  ]).pipe(
    switchMap(([searchTerm, currentPage]) =>
      this.favourService.favoursRequireMyVerify(searchTerm, currentPage)
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
