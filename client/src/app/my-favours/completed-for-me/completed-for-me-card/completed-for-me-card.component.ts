import { NgClass, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Favour } from '../../../services/favour.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-completed-for-me-card',
   imports: [MatIconModule, NgClass, MatCardModule, DatePipe, RouterLink, MatButtonModule],
  templateUrl: './completed-for-me-card.component.html',
  styleUrl: './completed-for-me-card.component.scss',

})
export class CompletedForMeCardComponent {
favour = input.required<Favour>();
}
