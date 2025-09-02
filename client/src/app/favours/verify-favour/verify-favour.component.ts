import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Favour, FavourService } from '../../services/favour.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageUploaderService } from '../../services/image-uploader.service';
import { NotificationService } from '../../services/notification.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-verify-favour',
  imports: [MatIconModule, CommonModule, MatCheckboxModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule, MatButtonToggleModule, MatSlideToggleModule, DatePipe],
  templateUrl: './verify-favour.component.html',
  styleUrl: './verify-favour.component.scss',

})
export class VerifyFavourComponent {

  favourId!: string;
  favour?: Favour;
  private uploadService = inject(ImageUploaderService);
  protected notificationService = inject(NotificationService);
  protected progressService = inject(ProgressService);
  private destroyRef = inject(DestroyRef);


  private router = inject(Router);
  constructor(
    private route: ActivatedRoute,
    private favourService: FavourService
  ) { }

  ngOnInit(): void {
    // Get ID from URL
    this.favourId = this.route.snapshot.paramMap.get('id')!;
    this.favourService.getFavour(this.favourId).pipe(
    ).subscribe(data => {
      if (data.status != 'RequiresVerify') {
         this.router.navigate([''])
      }
      this.favour = data;
    }
    );
  }

  loadFavour() {

  }
  get getUserFullName() {
    return this.favour?.claimedBy?.firstName + ' ' + this.favour?.claimedBy?.lastName
  }

  verify() {
    if (this.favourId) {
      // Update existing favour
      this.favourService.verifyFavour(this.favourId).pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.notificationService.success('Favour updated', 'Success');
          this.router.navigateByUrl('/my-favours/completed-for-me');
        })
      ).subscribe();

    }
  }
}
