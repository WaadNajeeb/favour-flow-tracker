import { NgClass, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Favour } from '../../../services/favour.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-completed-favour-card',
  imports: [MatIconModule, NgClass, MatCardModule, DatePipe, MatButtonModule, RouterLink],
  templateUrl: './completed-favour-card.component.html',
  styleUrl: './completed-favour-card.component.scss',

})
export class CompletedFavourCardComponent {
  favour = input.required<Favour>();
}
