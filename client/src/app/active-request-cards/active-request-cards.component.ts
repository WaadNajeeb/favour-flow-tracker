import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RequestCardComponent } from "../request-card/request-card.component";
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { FavourService } from '../services/favour.service';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-active-request-cards',
  imports: [RequestCardComponent, MatCardModule, MatIconModule, MatButtonModule, AvatarModule,AvatarGroupModule, AsyncPipe],
  templateUrl: './active-request-cards.component.html',
  styleUrl: './active-request-cards.component.scss',

})
export class ActiveRequestCardsComponent {

  private favourService = inject(FavourService);
  favours$ =  this.favourService.getRecentFavours().pipe();
requests = [
    {
      user: 'Sarah M.',
      timeAgo: '2 hours ago',
      title: 'Clean the office fridge',
      description: 'The fridge is getting messy and needs a good clean. Would appreciate help!',
      tags: ['Coffee', 'Chocolate'],
      avatarUrl: 'https://i.pravatar.cc/100?img=1'
    },
    {
      user: 'Mike R.',
      timeAgo: '5 hours ago',
      title: 'Pick up lunch order',
      description: 'Need someone to pick up our team lunch from the restaurant downtown.',
      tags: ['Pizza'],
      avatarUrl: 'https://i.pravatar.cc/100?img=2'
    },
    {
      user: 'Emma L.',
      timeAgo: '1 day ago',
      title: 'Water office plants',
      description: 'Plants need watering while I\'m away. Simple task, great rewards!',
      tags: ['Coffee', 'Candy'],
      avatarUrl: 'https://i.pravatar.cc/100?img=3'
    }
  ];
}
