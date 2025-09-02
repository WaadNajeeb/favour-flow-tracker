import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastrService: ToastrService) { }

  info(message: string, title?: string, timeout: number = 5000) {
    return this.toastrService.info(message, title, { timeOut: timeout });
  }
  success(message: string, title?: string) {
    return this.toastrService.success(message, title);
  }
  warn(message: string, title?: string, keepOpen?: boolean) {
    return this.toastrService.warning(message, title, { disableTimeOut: keepOpen });
  }

  error(message: string, title?: string) {
    return this.toastrService.error(message, title);
  }


  clear() {
    this.toastrService.clear()
  }
}
