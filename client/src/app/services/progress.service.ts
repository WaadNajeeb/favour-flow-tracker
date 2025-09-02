
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { ProgressIndicatorType, ProgressIndicatorComponent } from '../progress-indicator/progress-indicator.component';
import { Overlay } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private overlay = inject(Overlay)
  private readonly positionStrategy = this.overlay
    .position()
    .global()
    .centerHorizontally()
    .centerVertically();

  private readonly overlayRef = this.overlay.create({ hasBackdrop: true });

  constructor() {
    this.overlayRef.updatePositionStrategy(this.positionStrategy);
  }

  show(message?: string, type: ProgressIndicatorType = 'default', backdropClass: string | string[] = []) {
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    const componentRef = this.overlayRef.attach(new ComponentPortal(ProgressIndicatorComponent));
    componentRef.instance.message = message || '';
    componentRef.instance.type = type;

    const backdropClassList = Array.isArray(backdropClass) ? backdropClass : [backdropClass];

    backdropClassList.forEach(c => {
      this.overlayRef.backdropElement?.classList.add(c);
    });
  }

  hide(backdropClass: string | string[] = []) {
    this.overlayRef.detach();

    const backdropClassList = Array.isArray(backdropClass) ? backdropClass : [backdropClass];

    backdropClassList.forEach(c => {
      this.overlayRef.backdropElement?.classList.remove(c);
    });
  }

  showByStatus(status: boolean, message?: string, type: ProgressIndicatorType = 'default', backdropClass: string | string[] = []) {
    if (status) {
      this.show(message, type, backdropClass);
    } else {
      this.hide(backdropClass);
    }
  }

  showSplash(message: string) {
    this.show(message, 'splash', 'tq-splash-backdrop');
  }

  hideSplash() {
    this.hide('tq-splash-backdrop');
  }

  showErrorSplash(message: string) {
    this.show(message, 'error', 'tq-error-splash-backdrop');
  }
}
