import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Favour } from '../../../services/favour.service';
import { NgClass, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-owed-favour-card',
   imports: [MatIconModule, NgClass, MatCardModule, DatePipe, MatButtonModule, RouterLink],
  templateUrl: './owed-favour-card.component.html',
  styleUrl: './owed-favour-card.component.scss',

})
export class OwedFavourCardComponent {
favour = input.required<Favour>();
}
