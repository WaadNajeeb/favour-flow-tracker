import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Favour } from '../../services/favour.service';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, NgClass } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TimeAgoPipe } from '../../pipes/TimeAgo.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favour-request-card',
  imports: [MatCardModule, NgClass, MatChipsModule, TimeAgoPipe, MatIconModule, MatDivider, RouterLink],
  templateUrl: './favour-request-card.component.html',
  styleUrl: './favour-request-card.component.scss'
})
export class FavourRequestCardComponent {

  favour = input.required<Favour>();

  generateRandomHexColor(): string {
    // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Pad with leading zeros if the hex string is less than 6 characters
    return `#${randomColor.padStart(6, '0')}`;
  }
}
