import { inject, Injectable, REQUEST } from '@angular/core';
import { HttpService, RequestMethod } from './http.service';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly user: string = `${environment.apiUrl}/auth/current_user`;

  private httpService = inject(HttpService);
  private localStorageService = inject(LocalStorageService);

  getCurrentUser() {
    return this.httpService.request<User>(RequestMethod.GET, this.user);
  }

  getUser() {
    return this.localStorageService.getItem<User>('user');
  }


}
