import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',

})
export class MainComponent {

}
