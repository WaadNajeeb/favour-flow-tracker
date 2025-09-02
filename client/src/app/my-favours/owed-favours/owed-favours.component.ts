import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, switchMap, filter } from 'rxjs';
import { SearchTermFG } from '../../leaderboard/leaderboard.component';
import { FavourService } from '../../services/favour.service';
import { AsyncPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OwedFavourCardComponent } from "./owed-favour-card/owed-favour-card.component";

@Component({
  selector: 'app-owed-favours',
  imports: [MatPaginatorModule, AsyncPipe, MatDivider, OwedFavourCardComponent],
  templateUrl: './owed-favours.component.html',
  styleUrl: './owed-favours.component.scss',

})
export class OwedFavoursComponent {
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
      this.favourService.favoursAssignedToOthers(searchTerm, currentPage)
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
