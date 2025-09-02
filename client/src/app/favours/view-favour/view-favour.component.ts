import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Favour, FavourService } from '../../services/favour.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-view-favour',
  imports: [MatCardModule, NgClass, MatButtonModule, MatIconModule, MatChipsModule, DatePipe, CommonModule, RouterLink],
  templateUrl: './view-favour.component.html',
  styleUrl: './view-favour.component.scss'
})
export class ViewFavourComponent {
favourId!: string;
  favour?: Favour;

  constructor(
    private route: ActivatedRoute,
    private favourService: FavourService
  ) {}

  ngOnInit(): void {
    // Get ID from URL
    this.favourId = this.route.snapshot.paramMap.get('id')!;
    this.favourService.getFavour(this.favourId).pipe(
    ).subscribe( data => {
      this.favour = data;
    }
    );
  }

  loadFavour() {

  }
  get getUserFullName(){
    return this.favour?.from?.firstName + ' ' + this.favour?.from?.lastName
  }
}
