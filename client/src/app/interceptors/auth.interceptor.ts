import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, concatMap, filter, finalize, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private localStorageService = inject(LocalStorageService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const modifiedRequest = this.addAuthorizationHeader(request);

    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(modifiedRequest, next);
        }
        return of();
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refresh().pipe(
        switchMap((success: boolean) => {
          this.isRefreshing = false;

          if (success) {
            this.refreshTokenSubject.next(true);
            return next.handle(this.addAuthorizationHeader(request));
          } else {
            this.cleanUpOnFailedRefresh();
            // No refresh token or refresh failed → treat as guest (no error thrown)
            return of(new HttpResponse({ body: null }));
          }
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.cleanUpOnFailedRefresh();
          return of(new HttpResponse({ body: null }));
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(value => value !== null),
      take(1),
      switchMap(() => next.handle(this.addAuthorizationHeader(request)))
    );
  }


  private cleanUpOnFailedRefresh() {
    this.authService.signOutClient();
    this.localStorageService.removeItem('user');
  }

  private addAuthorizationHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
    // If you use cookies only, nothing to do here
    return request.clone({
      withCredentials: true
    });
  }
}
