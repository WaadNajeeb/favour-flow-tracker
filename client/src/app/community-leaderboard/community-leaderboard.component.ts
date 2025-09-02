import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FavourService } from '../services/favour.service';

@Component({
  selector: 'app-community-leaderboard',
  imports: [MatCardModule, MatIconModule, NgClass, MatButtonModule, AsyncPipe],
  templateUrl: './community-leaderboard.component.html',
  styleUrl: './community-leaderboard.component.scss',

})
export class CommunityLeaderboardComponent {
  leaderboard = [
    { rank: 1, name: 'Jessica Chen', score: 2450, badgeInfo: 'Top Contributor' },
    { rank: 2, name: 'David Park', score: 2180, badgeInfo: 'Active Helper' },
    { rank: 3, name: 'Maria Rodriguez', score: 1960, badgeInfo: 'Community Builder' },
  ];

  private favourService = inject(FavourService);

  communityLeaderboard$ = this.favourService.getCommunityFavours().pipe();

}
