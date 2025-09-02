import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [MatButtonModule, RouterLink, MatIconModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',

})
export class HeroComponent {

}
