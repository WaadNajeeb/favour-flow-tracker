import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { ActiveRequestCardsComponent } from "../active-request-cards/active-request-cards.component";
import { CommunityLeaderboardComponent } from "../community-leaderboard/community-leaderboard.component";
import { HomeFooterComponent } from '../home-footer/home-footer.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ActiveRequestCardsComponent, CommunityLeaderboardComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',

})
export class HomeComponent {

}
