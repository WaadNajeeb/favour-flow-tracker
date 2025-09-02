import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-footer',
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgStyle, RouterLink],
  templateUrl: './home-footer.component.html',
  styleUrl: './home-footer.component.scss',

})
export class HomeFooterComponent {
 features: Feature[] = [
    {
      icon: 'verified_user',
      color: '#6c63ff',
      title: 'Secure & Verified',
      description: 'Photo verification ensures all favors are legitimate and prevents cheating.',
    },
    {
      icon: 'smartphone',
      color: '#8a63ff',
      title: 'Easy to Use',
      description: 'Simple interface makes tracking favors effortless for everyone in your group.',
    },
    {
      icon: 'favorite',
      color: '#db4c84',
      title: 'Build Connections',
      description: 'Strengthen relationships through small acts of kindness and mutual support.',
    },
  ];
  linkGroups: FooterLinkGroup[] = [
    {
      heading: 'Platform',
      links: ['Requests', 'Leaderboard', 'Dashboard'],
    },
  ];
}
export interface Feature {
  icon: string;
  color: string;
  title: string;
  description: string;
}
export interface FooterLinkGroup {
  heading: string;
  links: string[];
}
