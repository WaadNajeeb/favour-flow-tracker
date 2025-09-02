import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Favour } from '../../../services/favour.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-i-owe-favour-card',
  imports: [MatIconModule, NgClass, MatCardModule, DatePipe, MatButtonModule, RouterLink],
  templateUrl: './i-owe-favour-card.component.html',
  styleUrl: './i-owe-favour-card.component.scss',

})
export class IOweFavourCardComponent {
  favour = input.required<Favour>();
}
