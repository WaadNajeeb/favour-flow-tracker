import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Favour } from '../../../services/favour.service';
import { NgClass, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-favour-require-my-verification-card',
    imports: [MatIconModule, NgClass, MatCardModule, DatePipe, RouterLink, MatButtonModule],
  templateUrl: './favour-require-my-verification-card.component.html',
  styleUrl: './favour-require-my-verification-card.component.scss',

})
export class FavourRequireMyVerificationCardComponent {
  favour = input.required<Favour>();
}
