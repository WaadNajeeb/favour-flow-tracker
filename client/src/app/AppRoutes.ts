import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { inject } from "@angular/core";
import { catchError, of, map } from "rxjs";
import { AuthService } from "./services/auth.service";
import { CompletedFavoursComponent } from "./my-favours/completed-favours/completed-favours.component";
import { OweFavoursComponent } from "./my-favours/owe-favours/owe-favours.component";
import { OwedFavoursComponent } from "./my-favours/owed-favours/owed-favours.component";
import { ViewFavourComponent } from "./favours/view-favour/view-favour.component";
import { RedeemFavourComponent } from "./favours/redeem-favour/redeem-favour.component";
import { MainComponent } from "./main/main.component";
import { CompletedForMeCardComponent } from "./my-favours/completed-for-me/completed-for-me-card/completed-for-me-card.component";
import { CompletedForMeComponent } from "./my-favours/completed-for-me/completed-for-me.component";
import { FavourRequireMyVerificationCardComponent } from "./my-favours/favour-require-my-verification/favour-require-my-verification-card/favour-require-my-verification-card.component";
import { FavourRequireMyVerificationComponent } from "./my-favours/favour-require-my-verification/favour-require-my-verification.component";
import { FavourRequireOtherVerificationComponent } from "./my-favours/favour-require-other-verification/favour-require-other-verification.component";
import { EditFavourComponent } from "./favours/edit-favour/edit-favour.component";
import { VerifyFavourComponent } from "./favours/verify-favour/verify-favour.component";


// Guard for authenticated users to access protected routes
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    .pipe(
      catchError(_ => {
        return of(true);
      }),
      map(isValid => {
        if (isValid) {
          return true;
        }
        router.createUrlTree([''])
        return false;
      })
    );
};

// Guard to prevent authenticated users from accessing sign-in/sign-up
// Guard to prevent authenticated users from accessing sign-in/sign-up
export const GuestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated()
    .pipe(
      catchError(_ => {
        return of(false);
      }),
      map(isValid => {
        if (isValid) {
          return router.createUrlTree(['']);
        }
        return true;
      })
    );
};


export const ROUTES: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'favour-requests', loadComponent: () => import('./favour-requests/favour-requests.component').then(m => m.FavourRequestsComponent) },
      { path: 'leaderboard', loadComponent: () => import('./leaderboard/leaderboard.component').then(m => m.LeaderboardComponent) },
      { path: 'view-favour/:id', component: ViewFavourComponent },
       { path: 'edit-favour/:id', component: EditFavourComponent, canActivate:[AuthGuard] },
      {
        path: 'redeem-favour/:id',
        component: RedeemFavourComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'verify-favour/:id',
        component: VerifyFavourComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-favours',
        loadComponent: () => import('./user-favours/user-favours.component').then(m => m.UserFavoursComponent),
        canActivate: [AuthGuard],
        children: [
          { path: 'i-owe', component: OweFavoursComponent },
          { path: 'owed-to-me', component: OwedFavoursComponent },
          { path: 'completed-for-me', component: CompletedForMeComponent },
          { path: 'i-completed', component: CompletedFavoursComponent },
          { path: 'awaiting-verification', component: FavourRequireMyVerificationComponent },
          { path: 'pending-verifications', component: FavourRequireOtherVerificationComponent },
          { path: '', redirectTo: 'i-owe', pathMatch: 'full' }
        ]
      },
      {
        path: 'create-favour',
        loadComponent: () => import('./favours/create-favour/create-favour.component').then(m => m.CreateFavourComponent),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'sign-in', loadComponent: () => import('./auth/sign-in/sign-in.component').then(m => m.SignInComponent) },
  { path: 'sign-up', loadComponent: () => import('./auth/sign-up/sign-up.component').then(m => m.SignUpComponent)  },
  { path: '**', redirectTo: '' }
];
