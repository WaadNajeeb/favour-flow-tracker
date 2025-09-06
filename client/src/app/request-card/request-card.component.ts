import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { Favour } from '../services/favour.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-request-card',
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatButtonModule, NgClass, RouterLink],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.scss',

})
export class RequestCardComponent {

  favour = input.required<Favour>();

  generateRandomHexColor(): string {
    // Generate a random number between 0 and 16777215 (0xFFFFFF in decimal)
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    // Pad with leading zeros if the hex string is less than 6 characters
    return `#${randomColor.padStart(6, '0')}`;
  }


  get getUserFullName(){
    return this.favour().from?.firstName + ' ' + this.favour().from?.lastName
  }

  get getInitals(){
     return this.favour().from?.firstName.charAt(0) + ""+ this.favour().from?.lastName.charAt(0);
  }
}
