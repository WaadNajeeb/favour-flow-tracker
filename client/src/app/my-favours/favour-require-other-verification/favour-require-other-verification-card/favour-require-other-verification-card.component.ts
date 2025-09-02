import { NgClass, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Favour } from '../../../services/favour.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favour-require-other-verification-card',
   imports: [MatIconModule, NgClass, MatCardModule, DatePipe,  MatButtonModule, RouterLink],
  templateUrl: './favour-require-other-verification-card.component.html',
  styleUrl: './favour-require-other-verification-card.component.scss',

})
export class FavourRequireOtherVerificationCardComponent {
  favour = input.required<Favour>();
}
