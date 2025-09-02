import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, filter, map, combineLatest, switchMap } from 'rxjs';
import { IOweFavourCardComponent } from "./i-owe-favour-card/i-owe-favour-card.component";
import { MatPaginatorModule } from '@angular/material/paginator';
import { AsyncPipe } from '@angular/common';
import { MatDivider } from '@angular/material/divider';
import { SearchTermFG } from '../../leaderboard/leaderboard.component';
import { FavourService } from '../../services/favour.service';

@Component({
  selector: 'app-owe-favours',
  imports: [IOweFavourCardComponent, MatPaginatorModule, AsyncPipe, MatDivider],
  templateUrl: './owe-favours.component.html',
  styleUrl: './owe-favours.component.scss',

})
export class OweFavoursComponent {

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
      this.favourService.favoursAssignedToMe(searchTerm, currentPage)
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
